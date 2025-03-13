-- KESKUSDIVARI LISÄYKSIÄ

INSERT INTO keskusdivari.TeosTyyppi (nimi)
VALUES ('romaani'), ('sarjakuva'), ('tietokirja'), ('kuvakirja')
ON CONFLICT DO NOTHING; -- jos haluaa päivittää tietoja, käytä ON CONFLICT (nimi) DO UPDATE SET nimi = EXCLUDED.nimi;

INSERT INTO keskusdivari.TeosLuokka (nimi)
VALUES ('historia'), ('romantiikka'), ('dekkari'), ('huumori'), ('opas'), ('seikkailu'), ('sikailu')
ON CONFLICT DO NOTHING; -- jos haluaa päivittää tietoja, käytä ON CONFLICT (nimi) DO UPDATE SET nimi = EXCLUDED.nimi;

INSERT INTO keskusdivari.Teos (isbn, nimi, tekija, hinta, julkaisuvuosi, paino, tyyppiId, luokkaId)
VALUES ('9155430674', 'Elektran tytär', 'Madeleine Brent', 9.99, 1986, 500, 
        (SELECT id FROM keskusdivari.TeosTyyppi WHERE nimi = 'romaani'),
        (SELECT id FROM keskusdivari.TeosLuokka WHERE nimi = 'romantiikka')),
       ('9156381451', 'Tuulentavoittelijan morsian', 'Madeleine Brent', 12.99, 1978, 700,
        (SELECT id FROM keskusdivari.TeosTyyppi WHERE nimi = 'romaani'), 
        (SELECT id FROM keskusdivari.TeosLuokka WHERE nimi = 'romantiikka')),
       (NULL, 'Turms kuolematon', 'Mika Waltari', 14.99, 1995, 1000,
        (SELECT id FROM keskusdivari.TeosTyyppi WHERE nimi = 'romaani'), 
        (SELECT id FROM keskusdivari.TeosLuokka WHERE nimi = 'historia')),
       (NULL, 'Komisario Palmun erehdys', 'Mika Waltari', 11.99, 1940, 800,
        (SELECT id FROM keskusdivari.TeosTyyppi WHERE nimi = 'romaani'), 
        (SELECT id FROM keskusdivari.TeosLuokka WHERE nimi = 'dekkari')),
       (NULL, 'Friikkilän pojat Mexicossa', 'Shelton Gilbert', 7.99, 1989, 200,
        (SELECT id FROM keskusdivari.TeosTyyppi WHERE nimi = 'sarjakuva'), 
        (SELECT id FROM keskusdivari.TeosLuokka WHERE nimi = 'huumori')),
       ('9789510396230', 'Miten saan ystäviä, menestystä, vaikutusvaltaa', 'Dale Carnegien', 9.99, 1939, 750,
        (SELECT id FROM keskusdivari.TeosTyyppi WHERE nimi = 'tietokirja'), 
        (SELECT id FROM keskusdivari.TeosLuokka WHERE nimi = 'opas'))
ON CONFLICT DO NOTHING;



INSERT INTO keskusdivari.Postikulutaulukko (max_paino, hinta)
VALUES (50, 2.50), (250, 5.00), (1000, 10.00), (2000, 15.00)
ON CONFLICT DO NOTHING;

INSERT INTO keskusdivari.KeskusdivariInfo (nimi, osoite, nettisivut)
VALUES ('Keskusdivari', 'Keskusdivarintie 1', 'www.keskusdivari.fi')
ON CONFLICT DO NOTHING;

-- DIVARI LISÄYKSIÄ

INSERT INTO keskusdivari.Divari (nimi, osoite, omaTietokanta)
VALUES ('Lassen lehti', 'Lehtikuja 1', TRUE),
       ('Galleinn Galle', 'Gallentie 2', FALSE)
ON CONFLICT DO NOTHING;

-- Don't add the other one
INSERT INTO divari.DivariInfo (nimi, osoite)
VALUES ('Lassen lehti', 'Lehtikuja 1')
ON CONFLICT DO NOTHING;

INSERT INTO divari.TeosTyyppi (nimi)
VALUES ('romaani'), ('sarjakuva'), ('tietokirja'), ('kuvakirja')
ON CONFLICT DO NOTHING;

INSERT INTO divari.TeosLuokka (nimi)
VALUES ('historia'), ('romantiikka'), ('dekkari'), ('huumori'), ('opas'), ('seikkailu'), ('sikailu')
ON CONFLICT DO NOTHING;


-- TRIGGER TESTAUS
--INSERT INTO divari.Teos (isbn, nimi, tekija, hinta, julkaisuvuosi, paino, tyyppiId, luokkaId, divariId)
--VALUES ('9155430674', 'Elektran tytär', 'Madeleine Brent', 9.99, 1986, 500, 
--        (SELECT id FROM divari.TeosTyyppi WHERE nimi = 'romaani'),
--        (SELECT id FROM divari.TeosLuokka WHERE nimi = 'romantiikka'), 1)
--ON CONFLICT DO NOTHING;
--
---- pitäis triggeraa
--INSERT INTO divari.Nide (teosId, ostohinta, myyntipvm, tila)
--VALUES((SELECT id FROM divari.Teos WHERE isbn='9155430674'), 5.99, '2021-01-01', 'vapaa');