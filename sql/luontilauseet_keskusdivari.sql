-- Create schema
CREATE SCHEMA IF NOT EXISTS keskusdivari;

-- Create tables in the keskusdivari schema
CREATE TABLE keskusdivari.KeskusdivariInfo (
    nimi VARCHAR(150) NOT NULL,
    osoite VARCHAR(150) NOT NULL,
    nettisivut VARCHAR(150) NOT NULL
);

CREATE TABLE keskusdivari.Divari (
    id SERIAL PRIMARY KEY,
    nimi VARCHAR(150) NOT NULL,
    osoite VARCHAR(150) NOT NULL,
    omaTietokanta BOOLEAN NOT NULL
);

CREATE TABLE keskusdivari.Kayttaja (
    id SERIAL PRIMARY KEY,
    nimi VARCHAR(150) NOT NULL,
    osoite VARCHAR(150) NOT NULL,
    sposti VARCHAR(150) UNIQUE NOT NULL,
    puh VARCHAR(50),
    salasana VARCHAR(150) UNIQUE NOT NULL,
    rooli VARCHAR(10) NOT NULL CHECK (rooli IN ('yllapitaja', 'asiakas'))
);

CREATE TABLE keskusdivari.Tilaus (
    id SERIAL PRIMARY KEY,
    tilauspvm DATE NOT NULL,
    hinta NUMERIC(10,2) NOT NULL,
    tila VARCHAR(13) NOT NULL CHECK (tila IN ('vahvistamaton', 'maksettu', 'lahetetty'))
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
    luokkaId INT REFERENCES keskusdivari.TeosLuokka(id) ON DELETE SET NULL
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