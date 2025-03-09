CREATE TABLE DivariInfo (
    nimi VARCHAR(150) NOT NULL,
    osoite VARCHAR(150) NOT NULL,
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
    isbn VARCHAR(17) CHECK (char_length(isbn) IN (10, 17)),
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
    ostohinta NUMERIC(10,2),
    myyntipvm DATE,
    tila VARCHAR(7) NOT NULL CHECK (tila IN ('vapaa', 'varattu', 'myyty'))
);