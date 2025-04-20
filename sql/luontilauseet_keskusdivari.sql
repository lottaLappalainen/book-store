-- Create schema
CREATE SCHEMA IF NOT EXISTS keskusdivari;

-- Create tables in the keskusdivari schema
CREATE TABLE keskusdivari.KeskusdivariInfo (
    nimi VARCHAR(150) NOT NULL UNIQUE,
    osoite VARCHAR(150) NOT NULL UNIQUE,
    nettisivut VARCHAR(150) NOT NULL UNIQUE
);

CREATE TABLE keskusdivari.SyncStatus (
    id SERIAL PRIMARY KEY,
    tauluNimi VARCHAR(50) NOT NULL UNIQUE,
    edellinenSync TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE keskusdivari.Divari (
    id SERIAL PRIMARY KEY,
    nimi VARCHAR(150) NOT NULL,
    osoite VARCHAR(150) NOT NULL,
    omaTietokanta BOOLEAN NOT NULL,
    CONSTRAINT unique_nimi_osoite UNIQUE (nimi, osoite)
);

CREATE TABLE keskusdivari.Kayttaja (
    id SERIAL PRIMARY KEY,
    nimi VARCHAR(150) NOT NULL,
    osoite VARCHAR(150) NOT NULL,
    sposti VARCHAR(150) UNIQUE NOT NULL,
    puh VARCHAR(50),
    salasana VARCHAR(150) NOT NULL,
    rooli VARCHAR(10) NOT NULL CHECK (rooli IN ('yllapitaja', 'asiakas'))
);

CREATE TABLE keskusdivari.Tilaus (
    id SERIAL PRIMARY KEY,
    tilauspvm DATE NOT NULL,
    hinta NUMERIC(10,2) NOT NULL,
    tila VARCHAR(13) NOT NULL CHECK (tila IN ('vahvistamaton', 'maksettu', 'lahetetty')),
    kayttajaId SERIAL REFERENCES keskusdivari.Kayttaja(id) ON DELETE SET NULL
);

CREATE TABLE keskusdivari.Lahetys (
    id SERIAL PRIMARY KEY,
    postikulut NUMERIC(10,2) NOT NULL,
    tilausId INT NOT NULL REFERENCES keskusdivari.Tilaus(id) ON DELETE CASCADE
);

CREATE TABLE keskusdivari.TeosTyyppi (
    id SERIAL PRIMARY KEY,
    nimi VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE keskusdivari.TeosLuokka (
    id SERIAL PRIMARY KEY,
    nimi VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE keskusdivari.Teos (
    id SERIAL PRIMARY KEY,
    isbn VARCHAR(13) CHECK (char_length(isbn) IN (10,13)) UNIQUE,
    nimi VARCHAR(150) NOT NULL,
    tekija VARCHAR(150) NOT NULL,
    hinta NUMERIC(10,2) NOT NULL,
    julkaisuvuosi INT NOT NULL,
    paino INT NOT NULL,
    tyyppiId INT REFERENCES keskusdivari.TeosTyyppi(id) ON DELETE SET NULL,
    luokkaId INT REFERENCES keskusdivari.TeosLuokka(id) ON DELETE SET NULL,
    CONSTRAINT unique_nimi_tekija UNIQUE (nimi, tekija)
);

CREATE TABLE keskusdivari.Nide (
    id SERIAL PRIMARY KEY,
    teosId INT NOT NULL REFERENCES keskusdivari.Teos(id) ON DELETE CASCADE,
    divariId INT NOT NULL REFERENCES keskusdivari.Divari(id) ON DELETE CASCADE,
    ostohinta NUMERIC(10,2),
    myyntipvm DATE,
    tila VARCHAR(7) NOT NULL CHECK (tila IN ('vapaa', 'varattu', 'myyty')),
    tilausId INT REFERENCES keskusdivari.Tilaus(id) ON DELETE SET NULL
);

CREATE TABLE keskusdivari.Postikulutaulukko (
    id SERIAL PRIMARY KEY, 
    max_paino INT UNIQUE NOT NULL,
    hinta NUMERIC(10,2) NOT NULL
);

-- Tapahtuma 6 --
CREATE OR REPLACE FUNCTION divari.sync_nide_to_keskusdivari()
RETURNS TRIGGER AS $$
BEGIN
    -- First, ensure the related Teos exists in keskusdivari
    DECLARE
        keskus_teos_id INTEGER;
        divari_teos_info RECORD;
        keskus_divari_id INTEGER;
        divari_info_d RECORD;
    BEGIN
        -- Get the Teos information from divari schema
        SELECT t.isbn, t.nimi, t.tekija INTO divari_teos_info 
        FROM divari.Teos t
        WHERE t.id = NEW.teosId;

        -- Get the corresponding Teos ID from keskusdivari
        IF (divari_teos_info.isbn IS NOT NULL) THEN
            SELECT id INTO keskus_teos_id
            FROM keskusdivari.Teos
            WHERE isbn = divari_teos_info.isbn
            LIMIT 1;
        ELSE
            SELECT id INTO keskus_teos_id
            FROM keskusdivari.Teos
            WHERE nimi = divari_teos_info.nimi AND tekija = divari_teos_info.tekija
            LIMIT 1;
        END IF;

        -- Don't do anything if teos not found in keskusdivari
        IF (keskus_teos_id IS NULL) THEN
            RETURN NULL;
        END IF;

        -- Get the Divari information from divari schema
        SELECT di.nimi, di.osoite INTO divari_info_d
        FROM divari.Nide n
        JOIN divari.Teos t ON n.teosId = t.id
        JOIN divari.DivariInfo di ON t.divariId = di.id
        WHERE n.id = NEW.id;

        -- Get the Divari information from keskusdivari schema
        SELECT d.id INTO keskus_divari_id
        FROM keskusdivari.Divari d
        WHERE d.nimi = divari_info_d.nimi AND d.osoite = divari_info_d.osoite;

        -- Now insert or update the Nide in keskusdivari
        INSERT INTO keskusdivari.Nide (
            teosId, divariId, ostohinta, myyntipvm, tila, tilausId
        )
        VALUES (
            keskus_teos_id,
            keskus_divari_id,
            NEW.ostohinta,
            NEW.myyntipvm,
            NEW.tila,
            NULL
        );
    END;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- T6
CREATE TRIGGER sync_nide_after_insert_update
AFTER INSERT OR UPDATE ON divari.Nide
FOR EACH ROW
EXECUTE FUNCTION divari.sync_nide_to_keskusdivari();
