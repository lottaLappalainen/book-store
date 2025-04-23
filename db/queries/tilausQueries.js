import { missingParams } from "../../utils/validationMessages.js"

export const createTilaus = (tilauspvm, hinta, tila = 'vahvistamaton', kayttajaId) => {
    if (!tilauspvm || !hinta) throw new Error(missingParams);

    return {
        text: `
            INSERT INTO keskusdivari.Tilaus (tilauspvm, hinta, tila, kayttajaId)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `,
        values: [tilauspvm, hinta, tila, kayttajaId],
    };
};

export const getTilausForUpdate = (id) => {
    return {
        text: `
            SELECT * FROM keskusdivari.Tilaus
            WHERE id = $1
            FOR UPDATE;
        `,
        values: [id],
    }
};

export const updateTilaus = (id, tilauspvm, hinta, tila, kayttajaId) => {
    return {
        text: `
            UPDATE keskusdivari.Tilaus
            SET tilauspvm = $2,
                hinta = $3,
                tila = $4,
                kayttajaId = $5
            WHERE id = $1;
        `,
        values: [id, tilauspvm, hinta, tila, kayttajaId],
    };
};

export const deleteTilaus = (id) => {
    return {
        text: `
            DELETE FROM keskusdivari.Tilaus
            WHERE id = $1;
        `,
        values: [id],
    };
};

export const reserveNiteet = (teosId, quantity) => {

    return {
        text: `
            WITH cte AS (
                SELECT id
                FROM keskusdivari.Nide
                WHERE teosId = $1 AND tila = 'vapaa'
                LIMIT $2
                FOR UPDATE
            )
            UPDATE keskusdivari.Nide
            SET tila = 'varattu'
            WHERE id IN (SELECT id FROM cte)
            RETURNING *;
        `,
        values: [teosId, quantity],
    };
};

export const sellNide = (tilausId, nideId) => {
    const currDate = new Date();
    return {
        text: `
            UPDATE keskusdivari.Nide
            SET tila = 'myyty',
                tilausId = $1,
                myyntipvm = $3
            WHERE id = $2
            RETURNING *;
        `,
        values: [tilausId, nideId, currDate],
    };
};

export const getYksDivariNiteetByTeosNimi = (nimi) => {
    return {
        text: `
            SELECT * FROM divari.Nide n
            INNER JOIN divari.TEOS t on  
        `,
    };
};

export const sellNideYksDivari = (nideId, hinta) => {
    const date = new Date();
    return {
        text: `
            UPDATE divari.Nide
            SET tila = 'myyty',
                myyntipvm = $1,
                ostohinta = $2
            WHERE id = $3
            RETURNING *;
        `,
        values: [date, hinta, nideId],
    };
};

export const createLahetys = (postikulut, tilausId) => {
    return {
        text: `
            INSERT INTO keskusdivari.Lahetys (postikulut, tilausId)
            VALUES ($1, $2)
            RETURNING *;
        `,
        values: [postikulut, tilausId],
    };
};

export const releaseNide = (nideId) => {

    return {
        text: `
            UPDATE keskusdivari.Nide
            SET tila = 'vapaa'
            WHERE id = $1;
        `,
        values: [nideId],
    };
};