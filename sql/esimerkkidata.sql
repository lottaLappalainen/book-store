-- KESKUSDIVARI LISÄYKSIÄ

INSERT INTO keskusdivari.TeosTyyppi (nimi)
VALUES ('romaani'), ('sarjakuva'), ('tietokirja'), ('kuvakirja')
ON CONFLICT DO NOTHING; -- jos haluaa päivittää tietoja, käytä ON CONFLICT (nimi) DO UPDATE SET nimi = EXCLUDED.nimi;

INSERT INTO keskusdivari.TeosLuokka (nimi)
VALUES ('historia'), ('romantiikka'), ('dekkari'), ('huumori'), ('opas'), ('seikkailu'), ('sikailu')
ON CONFLICT DO NOTHING; -- jos haluaa päivittää tietoja, käytä ON CONFLICT (nimi) DO UPDATE SET nimi = EXCLUDED.nimi;

INSERT INTO keskusdivari.Kayttaja (nimi, osoite, sposti, puh, salasana, rooli)
VALUES 
    ('Asiakas', 'Testikuja 1, 00100 Helsinki', 'asiakas@testi.com', '0401234567', 'asiakas', 'asiakas'),
    ('Yllapitaja', 'Hallintotie 2, 00200 Espoo', 'admin@testi.com', '0509876543', 'admin', 'yllapitaja')
ON CONFLICT (sposti) DO NOTHING;
-- esimerkki käyttäjät

-- TODO: Siirrä nää kirjat jollekin Divarille
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

INSERT INTO keskusdivari.Divari (nimi, osoite, omaTietokanta)
VALUES ('Lassen lehti', 'Lehtikuja 1', TRUE),
       ('Galleinn Galle', 'Gallentie 2', FALSE)
ON CONFLICT DO NOTHING;

-- DIVARI LISÄYKSIÄ

-- DIVARI LISÄYKSIÄ

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

INSERT INTO keskusdivari.Nide (teosId, divariId, ostohinta, myyntipvm, tila, tilausid)
VALUES 
    ((SELECT id FROM keskusdivari.Teos WHERE COALESCE(isbn, '') = '9155430674'), 1, 5.99, '2021-01-01', 'vapaa', NULL),
    ((SELECT id FROM keskusdivari.Teos WHERE COALESCE(isbn, '') = '9156381451'), 1, 7.99, '2021-02-15', 'myyty', NULL),
    ((SELECT id FROM keskusdivari.Teos WHERE COALESCE(isbn, '') = '9789510396230'), 2, 4.99, '2023-05-20', 'varattu', NULL),
    ((SELECT id FROM keskusdivari.Teos WHERE nimi='Komisario Palmun erehdys' AND tekija='Mika Waltari'), 2, 6.50, NULL, 'vapaa', NULL),
    ((SELECT id FROM keskusdivari.Teos WHERE nimi='Friikkilän pojat Mexicossa' AND tekija='Shelton Gilbert'), 1, 3.50, '2022-10-10', 'myyty', NULL);

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

-- INSERT INTO divari.Teos (isbn, nimi, tekija, hinta, julkaisuvuosi, paino, tyyppiId, luokkaId, divariId)
-- VALUES ('1234598765', 'Testikirja', 'Kuppi Javaa', 4.99, 2025, 900, 
--         (SELECT id FROM divari.TeosTyyppi WHERE nimi = 'tietokirja'),
--         (SELECT id FROM divari.TeosLuokka WHERE nimi = ''), 1)
-- ON CONFLICT DO NOTHING;

-- t6 testi
--INSERT INTO divari.Teos (isbn, nimi, tekija, hinta, julkaisuvuosi, paino, tyyppiId, luokkaId, divariId)
--VALUES ('1234598765', 'Testikirja', 'Kuppi Javaa', 4.99, 2025, 900,
        --(SELECT id FROM divari.TeosTyyppi WHERE nimi = 'tietokirja'),
        --(SELECT id FROM divari.TeosLuokka WHERE nimi = 'opas'), 1)
--ON CONFLICT DO NOTHING;

--INSERT INTO keskusdivari.Teos (isbn, nimi, tekija, hinta, julkaisuvuosi, paino, tyyppiId, luokkaId)
--VALUES ('1234598765', 'Testikirja', 'Kuppi Javaa', 4.99, 2025, 900,
        --(SELECT id FROM keskusdivari.TeosTyyppi WHERE nimi = 'tietokirja'),
        --(SELECT id FROM keskusdivari.TeosLuokka WHERE nimi = 'opas'))
--ON CONFLICT DO NOTHING;

--INSERT INTO divari.Nide (teosId, ostohinta, myyntipvm, tila)
--VALUES((SELECT id FROM divari.Teos WHERE isbn='1234598765'),
        --3.99, '2021-01-01', 'vapaa');
-- end testi

INSERT INTO keskusdivari.SyncStatus (tauluNimi)
VALUES ('Teos'), ('Nide');

-- t7 testailua varten, lisää eka teos, sitten nide, sitten paina synkkaa divarit nappia
-- ei triggeröi t6, koska teoksen tietoja ei ole keskusdivarissa nidettä lisättäessä
-- INSERT INTO divari.Teos (isbn, nimi, tekija, hinta, julkaisuvuosi, paino, tyyppiId, luokkaId, divariId)
-- VALUES ('9876543210', 'Opus elämästä', 'Jepulis', 7.99, 2023, 600, 
--         (SELECT id FROM divari.TeosTyyppi WHERE nimi = 'tietokirja'),
--         (SELECT id FROM divari.TeosLuokka WHERE nimi = 'opas'), 1)
-- ON CONFLICT DO NOTHING;
-- 
-- INSERT INTO divari.Nide (teosId, ostohinta, myyntipvm, tila)
-- VALUES ((SELECT id FROM divari.Teos WHERE isbn='9876543210'), 5.99, '2021-01-01', 'vapaa');

-- UUSIA TEOKSIA TESTAUKSEEN JA NITEITÄ

-- Keskusdivari: Lisää kirjoja
INSERT INTO keskusdivari.Teos (isbn, nimi, tekija, hinta, julkaisuvuosi, paino, tyyppiId, luokkaId)
VALUES 
    ('1111111111', 'Kissan elämä ja kuolema', 'Taru Tietäväinen', 6.99, 2000, 300, 
        (SELECT id FROM keskusdivari.TeosTyyppi WHERE nimi = 'romaani'),
        (SELECT id FROM keskusdivari.TeosLuokka WHERE nimi = 'seikkailu')),
    ('2222222222', 'Elämä kuoleman jälkeen', 'Veikko Viisas', 8.99, 2010, 400,
        (SELECT id FROM keskusdivari.TeosTyyppi WHERE nimi = 'tietokirja'),
        (SELECT id FROM keskusdivari.TeosLuokka WHERE nimi = 'historia')),
    ('3333333333', 'Kuoleman kosketus', 'Musta Varjo', 10.50, 2005, 600,
        (SELECT id FROM keskusdivari.TeosTyyppi WHERE nimi = 'romaani'),
        (SELECT id FROM keskusdivari.TeosLuokka WHERE nimi = 'dekkari')),
    ('4444444444', 'Elämä kissan kanssa', 'Lilli Leikkonen', 5.50, 2015, 250,
        (SELECT id FROM keskusdivari.TeosTyyppi WHERE nimi = 'kuvakirja'),
        (SELECT id FROM keskusdivari.TeosLuokka WHERE nimi = 'huumori')),
    ('5555555555', 'Kissat ja kuolemat', 'Riku Riipinen', 7.25, 2018, 320,
        (SELECT id FROM keskusdivari.TeosTyyppi WHERE nimi = 'sarjakuva'),
        (SELECT id FROM keskusdivari.TeosLuokka WHERE nimi = 'sikailu'))
ON CONFLICT DO NOTHING;

-- Lisää niteitä — useampi per kirja
INSERT INTO keskusdivari.Nide (teosId, divariId, ostohinta, myyntipvm, tila, tilausid)
VALUES 
    -- Kissan elämä ja kuolema
    ((SELECT id FROM keskusdivari.Teos WHERE isbn='1111111111'), 1, 3.99, NULL, 'vapaa', NULL),
    ((SELECT id FROM keskusdivari.Teos WHERE isbn='1111111111'), 2, 4.25, NULL, 'vapaa', NULL),

    -- Elämä kuoleman jälkeen
    ((SELECT id FROM keskusdivari.Teos WHERE isbn='2222222222'), 1, 4.50, NULL, 'vapaa', NULL),
    ((SELECT id FROM keskusdivari.Teos WHERE isbn='2222222222'), 2, 4.75, NULL, 'vapaa', NULL),

    -- Kuoleman kosketus
    ((SELECT id FROM keskusdivari.Teos WHERE isbn='3333333333'), 2, 5.99, '2023-12-01', 'myyty', NULL),
    ((SELECT id FROM keskusdivari.Teos WHERE isbn='3333333333'), 1, 5.50, NULL, 'vapaa', NULL),

    -- Elämä kissan kanssa
    ((SELECT id FROM keskusdivari.Teos WHERE isbn='4444444444'), 1, 2.99, NULL, 'vapaa', NULL),

    -- Kissat ja kuolemat
    ((SELECT id FROM keskusdivari.Teos WHERE isbn='5555555555'), 2, 3.75, '2022-08-12', 'myyty', NULL),
    ((SELECT id FROM keskusdivari.Teos WHERE isbn='5555555555'), 1, 3.25, NULL, 'vapaa', NULL)
ON CONFLICT DO NOTHING;

-- Sama divari skeemaan
INSERT INTO divari.Teos (isbn, nimi, tekija, hinta, julkaisuvuosi, paino, tyyppiId, luokkaId, divariId)
VALUES 
    ('1111111111', 'Kissan elämä ja kuolema', 'Taru Tietäväinen', 6.99, 2000, 300, 
        (SELECT id FROM divari.TeosTyyppi WHERE nimi = 'romaani'),
        (SELECT id FROM divari.TeosLuokka WHERE nimi = 'seikkailu'), 1),
    ('2222222222', 'Elämä kuoleman jälkeen', 'Veikko Viisas', 8.99, 2010, 400,
        (SELECT id FROM divari.TeosTyyppi WHERE nimi = 'tietokirja'),
        (SELECT id FROM divari.TeosLuokka WHERE nimi = 'historia'), 1),
    ('3333333333', 'Kuoleman kosketus', 'Musta Varjo', 10.50, 2005, 600,
        (SELECT id FROM divari.TeosTyyppi WHERE nimi = 'romaani'),
        (SELECT id FROM divari.TeosLuokka WHERE nimi = 'dekkari'), 1),
    ('4444444444', 'Elämä kissan kanssa', 'Lilli Leikkonen', 5.50, 2015, 250,
        (SELECT id FROM divari.TeosTyyppi WHERE nimi = 'kuvakirja'),
        (SELECT id FROM divari.TeosLuokka WHERE nimi = 'huumori'), 1),
    ('5555555555', 'Kissat ja kuolemat', 'Riku Riipinen', 7.25, 2018, 320,
        (SELECT id FROM divari.TeosTyyppi WHERE nimi = 'sarjakuva'),
        (SELECT id FROM divari.TeosLuokka WHERE nimi = 'sikailu'), 1)
ON CONFLICT DO NOTHING;

INSERT INTO divari.Nide (teosId, ostohinta, myyntipvm, tila)
VALUES 
    ((SELECT id FROM divari.Teos WHERE isbn='1111111111'), 3.99, NULL, 'vapaa'),
    ((SELECT id FROM divari.Teos WHERE isbn='2222222222'), 4.25, NULL, 'vapaa'),
    ((SELECT id FROM divari.Teos WHERE isbn='3333333333'), 5.99, '2023-12-01', 'myyty'),
    ((SELECT id FROM divari.Teos WHERE isbn='3333333333'), 5.50, NULL, 'vapaa'),
    ((SELECT id FROM divari.Teos WHERE isbn='4444444444'), 2.99, NULL, 'vapaa'),
    ((SELECT id FROM divari.Teos WHERE isbn='5555555555'), 3.75, '2022-08-12', 'myyty'),
    ((SELECT id FROM divari.Teos WHERE isbn='5555555555'), 3.25, NULL, 'vapaa');

-- END LISÄYKSET
