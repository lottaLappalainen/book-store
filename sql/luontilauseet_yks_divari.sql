-- Create schema
CREATE SCHEMA IF NOT EXISTS divari;

-- Create tables in the divari schema
CREATE TABLE divari.DivariInfo (
    nimi VARCHAR(150) NOT NULL,
    osoite VARCHAR(150) NOT NULL
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
    CONSTRAINT unique_nimi_tekija UNIQUE (nimi, tekija)
);

CREATE TABLE divari.Nide (
    id SERIAL PRIMARY KEY,
    teosId INT NOT NULL REFERENCES divari.Teos(id) ON DELETE CASCADE,
    ostohinta NUMERIC(10,2),
    myyntipvm DATE,
    tila VARCHAR(7) NOT NULL CHECK (tila IN ('vapaa', 'varattu', 'myyty'))
);