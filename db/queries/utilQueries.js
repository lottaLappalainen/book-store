

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