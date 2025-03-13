INSERT INTO keskusdivari.TeosTyyppi (nimi)
VALUES ('romaani'), ('sarjakuva'), ('tietokirja'), ('kuvakirja')
ON CONFLICT DO NOTHING; -- jos haluaa päivittää tietoja, käytä ON CONFLICT (nimi) DO UPDATE SET nimi = EXCLUDED.nimi;

INSERT INTO keskusdivari.TeosLuokka (nimi)
VALUES ('historia'), ('romantiikka'), ('dekkari'), ('huumori'), ('opas'), ('seikkailu'), ('sikailu')
ON CONFLICT DO NOTHING; -- jos haluaa päivittää tietoja, käytä ON CONFLICT (nimi) DO UPDATE SET nimi = EXCLUDED.nimi;

INSERT INTO keskusdivari.Teos (isbn, nimi, tekija, hinta, julkaisuvuosi, paino, tyyppiId, luokkaId)
VALUES ('9155430674', 'Elektran tytär', 'Madeleine Brent', 9.99, 1986, 500, 
        (SELECT id FROM keskusdivari.TeosTyyppi WHERE nimi = 'romaani'), 
        (SELECT id FROM keskusdivari.TeosLuokka WHERE nimi = 'romantiikka'))
ON CONFLICT (isbn) DO UPDATE SET -- jos isbn on jo olemassa, päivitä tiedot
    nimi = EXCLUDED.nimi,
    tekija = EXCLUDED.tekija,
    hinta = EXCLUDED.hinta,
    paino = EXCLUDED.paino,
    julkaisuvuosi = EXCLUDED.julkaisuvuosi,
    tyyppiId = EXCLUDED.tyyppiId,
    luokkaId = EXCLUDED.luokkaId;


INSERT INTO keskusdivari.Teos (isbn, nimi, tekija, hinta, julkaisuvuosi, paino, tyyppiId, luokkaId)
VALUES ('9156381451', 'Tuulentavoittelijan morsian', 'Madeleine Brent', 12.99, 1978, 700, 
        (SELECT id FROM keskusdivari.TeosTyyppi WHERE nimi = 'romaani'), 
        (SELECT id FROM keskusdivari.TeosLuokka WHERE nimi = 'romantiikka'))
ON CONFLICT (isbn) DO UPDATE SET -- jos isbn on jo olemassa, päivitä tiedot
    nimi = EXCLUDED.nimi,
    tekija = EXCLUDED.tekija,
    hinta = EXCLUDED.hinta,
    paino = EXCLUDED.paino,
    julkaisuvuosi = EXCLUDED.julkaisuvuosi,
    tyyppiId = EXCLUDED.tyyppiId,
    luokkaId = EXCLUDED.luokkaId;


INSERT INTO keskusdivari.Teos (isbn, nimi, tekija, hinta, julkaisuvuosi, paino, tyyppiId, luokkaId)
VALUES (NULL, 'Turms kuolematon', 'Mika Waltari', 14.99, 1995, 1000, 
        (SELECT id FROM keskusdivari.TeosTyyppi WHERE nimi = 'romaani'), 
        (SELECT id FROM keskusdivari.TeosLuokka WHERE nimi = 'historia'));

INSERT INTO keskusdivari.Teos (isbn, nimi, tekija, hinta, julkaisuvuosi, paino, tyyppiId, luokkaId)
VALUES (NULL, 'Komisario Palmun erehdys', 'Mika Waltari', 11.99, 1940, 800, 
        (SELECT id FROM keskusdivari.TeosTyyppi WHERE nimi = 'romaani'), 
        (SELECT id FROM keskusdivari.TeosLuokka WHERE nimi = 'dekkari'));

INSERT INTO keskusdivari.Teos (isbn, nimi, tekija, hinta, julkaisuvuosi, paino, tyyppiId, luokkaId)
VALUES (NULL, 'Friikkilän pojat Mexicossa', 'Shelton Gilbert', 7.99, 1989, 200, 
        (SELECT id FROM keskusdivari.TeosTyyppi WHERE nimi = 'sarjakuva'), 
        (SELECT id FROM keskusdivari.TeosLuokka WHERE nimi = 'huumori'));

INSERT INTO keskusdivari.Teos (isbn, nimi, tekija, hinta, julkaisuvuosi, paino, tyyppiId, luokkaId)
VALUES ('9789510396230', 'Miten saan ystäviä, menestystä, vaikutusvaltaa', 'Dale Carnegien', 9.99, 1939, 750, 
        (SELECT id FROM keskusdivari.TeosTyyppi WHERE nimi = 'tietokirja'), 
        (SELECT id FROM keskusdivari.TeosLuokka WHERE nimi = 'opas'))
ON CONFLICT (isbn) DO UPDATE SET -- jos isbn on jo olemassa, päivitä tiedot
    nimi = EXCLUDED.nimi,
    tekija = EXCLUDED.tekija,
    hinta = EXCLUDED.hinta,
    paino = EXCLUDED.paino,
    julkaisuvuosi = EXCLUDED.julkaisuvuosi,
    tyyppiId = EXCLUDED.tyyppiId,
    luokkaId = EXCLUDED.luokkaId;