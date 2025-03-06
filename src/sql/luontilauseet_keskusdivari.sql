CREATE TABLE KeskusdivariInfo (
    nimi VARCHAR(150) NOT NULL,
    osoite VARCHAR(150) NOT NULL,
    nettisivut VARCHAR(150) NOT NULL
);

CREATE TABLE Divari (
    id SERIAL PRIMARY KEY,
    nimi VARCHAR(150) NOT NULL,
    osoite VARCHAR(150) NOT NULL,
    omaTietokanta boolean
);

CREATE TABLE Kayttaja (
    id SERIAL PRIMARY KEY,
    nimi VARCHAR(150) NOT NULL,
    osoite VARCHAR(150) NOT NULL,
    sposti VARCHAR(150) UNIQUE NOT NULL,
    puh VARCHAR(50),
    salasana VARCHAR(150) NOT NULL,
    rooli VARCHAR(10) NOT NULL CHECK (rooli IN ('yllapitaja', 'asiakas'))
);


CREATE TABLE Tilaus (
    id SERIAL PRIMARY KEY,
    tilauspvm DATE NOT NULL,
    hinta NUMERIC(10,2) NOT NULL,
    tila VARCHAR(13) NOT NULL CHECK (tila IN ('vahvistamaton', 'maksettu', 'lahetetty')),
);

CREATE TABLE Lahetys (
    id SERIAL PRIMARY KEY,
    postikulut NUMERIC(10,2) NOT NULL,
    tilausId INT NOT NULL REFERENCES Tilaus(id) ON DELETE CASCADE
);

CREATE TABLE TeosTyyppi (
    id SERIAL PRIMARY KEY,
    nimi VARCHAR(50) NOT NULL
);

CREATE TABLE TeosLuokka (
    id SERIAL PRIMARY KEY,
    nimi VARCHAR(50) NOT NULL
);

CREATE TABLE Teos (
    id SERIAL PRIMARY KEY,
    isbn VARCHAR(13) CHECK (char_length(isbn) IN (10,13)),
    nimi VARCHAR(150) NOT NULL,
    tekija VARCHAR(150) NOT NULL,
    hinta NUMERIC(10,2) NOT NULL,
    paino INT NOT NULL,
    tyyppiId INT REFERENCES TeosTyyppi(id) ON DELETE SET NULL,
    luokkaId INT REFERENCES TeosLuokka(id) ON DELETE SET NULL
);

CREATE TABLE Nide (
    id SERIAL PRIMARY KEY,
    teosId NOT NULL REFERENCES Teos(id) ON DELETE CASCADE,
    divariId INT NOT NULL REFERENCES Divari(id) ON DELETE CASCADE,
    ostohinta NUMERIC(10,2),
    myyntipvm DATE,
    tila VARCHAR(7) NOT NULL CHECK (tila IN ('vapaa', 'varattu', 'myyty'))
    tilausId INT REFERENCES Tilaus(id) ON DELETE SET NULL
);

CREATE TABLE Postikulutaulukko (
    id SERIAL PRIMARY KEY, 
    max_paino INT UNIQUE NOT NULL,
    hinta NUMERIC(10,2) NOT NULL
);