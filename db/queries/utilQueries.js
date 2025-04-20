

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
            AND EXTRACT(YEAR FROM t.tilauspvm) = EXTRACT(YEAR FROM CURRENT_DATE) - 1 
            GROUP BY k.id, k.nimi
            ORDER BY tilauslkm DESC;
        `,
    };
};