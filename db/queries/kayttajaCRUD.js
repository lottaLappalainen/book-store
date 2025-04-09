import { invalidId, missingParams, invalidEmail, invalidRooli } from '../../utils/validationMessages.js'
import { validateEmail, validateRooli } from "../../utils/validators.js";


export const createKayttaja = (nimi, osoite, sposti, puh, salasana, rooli = 'asiakas') => {
    if (!nimi, !osoite, !sposti, !salasana) throw new Error(missingParams);
    if (!validateEmail(sposti)) throw new Error(invalidEmail);
    return {
        text: `
            INSERT INTO keskusdivari.Kayttaja (nimi, osoite, sposti, puh, salasana, rooli)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `,
        values: [nimi, osoite, sposti, puh, salasana, rooli],
    };
};

export const getKayttaja = (id) => {
    if (!id || isNaN(id)) throw new Error(invalidId);
    return {
        text: `
            SELECT * FROM keskusdivari.Kayttaja WHERE id = $1;
        `,
        values: [id],
    };
};

export const getKayttajaByEmail = (sposti) => {
    return {
        text: 'SELECT * FROM keskusdivari.Kayttaja WHERE sposti = $1',
        values: [sposti],
    };
};

export const getAllKayttajat = () => {
    return {
        text: `
            SELECT * FROM keskusdivari.Kayttaja;
        `,
    };
};

//TODO: Lisää puh validointi tarvittaessa
export const updateKayttaja = (id, nimi, osoite, sposti, puh, salasana, rooli) => {
    if (!id || isNaN(id)) throw new Error(invalidId);
    if (rooli && !validateRooli(rooli)) throw new Error(invalidRooli);
    return {
        text: `
            UPDATE keskusdivari.Kayttaja
            SET nimi = COALESCE($1, nimi),
                osoite = COALESCE($2, osoite),
                sposti = COALESCE($3, sposti),
                puh = COALESCE($4, puh),
                salasana = COALESCE($5, salasana),
                rooli = COALESCE($6, rooli)
            WHERE id = $7
            RETURNING nimi, osoite, sposti, puh, rooli;
        `,
        values: [nimi, osoite, sposti, puh, salasana, rooli, id],
    };
};

export const deleteKayttaja = (id) => {
    if (!id || isNaN(id)) throw new Error(invalidId);
    return {
        text: `
            DELETE FROM keskusdivari.Kayttaja
            WHERE id = $1
            RETURNING *;
        `,
        values: [id],
    };
};