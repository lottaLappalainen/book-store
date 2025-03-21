-- Create schema
CREATE SCHEMA IF NOT EXISTS divari;

-- Create tables in the divari schema
CREATE TABLE divari.DivariInfo (
    id SERIAL PRIMARY KEY,
    nimi VARCHAR(150) NOT NULL,
    osoite VARCHAR(150) NOT NULL,
    CONSTRAINT unique_nimi_osoite UNIQUE (nimi, osoite)
);

CREATE TABLE divari.TeosTyyppi (
    id SERIAL PRIMARY KEY,
    nimi VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE divari.TeosLuokka (
    id SERIAL PRIMARY KEY,
    nimi VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE divari.Teos (
    id SERIAL PRIMARY KEY,
    isbn VARCHAR(17) CHECK (char_length(isbn) IN (10, 13)) UNIQUE,
    nimi VARCHAR(150) NOT NULL,
    tekija VARCHAR(150) NOT NULL,
    hinta NUMERIC(10,2) NOT NULL,
    julkaisuvuosi INT NOT NULL,
    paino INT NOT NULL,
    tyyppiId INT REFERENCES divari.TeosTyyppi(id) ON DELETE SET NULL,
    luokkaId INT REFERENCES divari.TeosLuokka(id) ON DELETE SET NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    divariId INT NOT NULL REFERENCES divari.DivariInfo(id) ON DELETE CASCADE,
    CONSTRAINT unique_nimi_tekija UNIQUE (nimi, tekija)
);

CREATE TABLE divari.Nide (
    id SERIAL PRIMARY KEY,
    teosId INT NOT NULL REFERENCES divari.Teos(id) ON DELETE CASCADE,
    ostohinta NUMERIC(10,2),
    myyntipvm DATE,
    tila VARCHAR(7) NOT NULL CHECK (tila IN ('vapaa', 'varattu', 'myyty')),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Automatically update the `updated_at` column on updates
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_on_teos
BEFORE UPDATE ON divari.Teos
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER set_timestamp_on_nide
BEFORE UPDATE ON divari.Nide
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();