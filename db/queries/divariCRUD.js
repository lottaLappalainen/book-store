import { missingParams, invalidId } from '../../utils/validationMessages';

export const createDivari = (nimi, osoite, omaTietokanta = false) => {
    if (!nimi || !osoite) throw new Error(missingParams);
    return {
        text: `
            INSERT INTO Divari (nimi, osoite, omaTietokanta)
            VALUES ($1, $2, $3)
            RETURNING *;
        `,
        values: [nimi, osoite, omaTietokanta],
    };
};

export const getDivari = (id) => {
    if (!id || isNaN(id)) throw new Error(invalidId);
    return {
        text: `
            SELECT * FROM Divari WHERE id = $1;
        `,
        values: [id],
    };
};

export const getAllDivarit = () => {
    return { text: `SELECT * FROM Divari`, };
};

export const updateDivari = (id, nimi = null, osoite = null, omaTietokanta = null) => {
    if (!id || isNaN(id)) throw new Error(invalidId);
    return {
        text: `
            UPDATE Divari
            SET nimi = COALESCE($1, nimi),
                osoite = COALESCE($2, osoite),
                omaTietokanta = COALESCE($3, omaTietokanta)
            WHERE id = $4
            RETURNING *; 
        `,
        values: [nimi, osoite, omaTietokanta, id],
    };
};

export const deleteDivari = (id) => {
    if (!id || isNaN(id)) throw new Error(invalidId);
    return {
        text: `
            DELETE FROM Divari
            WHERE id = $1
            RETURNING *;
        `,
        values: [id],
    };
};