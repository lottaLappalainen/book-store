

export const getPostikulutaulukko = () => {
    return {
        text: `
            SELECT * FROM keskusdivari.Postikulutaulukko;
        `,
    };
};