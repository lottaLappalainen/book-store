

export const getPostikulutaulukko = () => {
    return {
        text: `
            SELECT * FROM keskusdivari.Postikulutaulukko;
        `,
    };
};

// Get eri tyypit
export const getTyypit = () => {
    return {
        text: `SELECT id, nimi FROM keskusdivari.TeosTyyppi;`,
    };
};

// Get eri luokat
export const getLuokat = () => {
    return {
        text: `SELECT id, nimi FROM keskusdivari.TeosLuokka;`,
    };
};

//R3
export const getUsersLastYearOrders = () => {
    return {
        text: `
            SELECT k.id, k.nimi, COUNT(t.id) AS tilauslkm 
            FROM keskusdivari.Kayttaja k
            LEFT JOIN keskusdivari.Tilaus t ON k.id = t.kayttajaId
            AND t.tilauspvm >= CURRENT_DATE - INTERVAL '1 year'
            AND t.tilauspvm <= CURRENT_DATE
            GROUP BY k.id, k.nimi
            ORDER BY tilauslkm DESC;
        `,
    };
};