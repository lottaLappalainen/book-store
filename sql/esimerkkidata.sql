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