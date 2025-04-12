import { missingParams } from "../../utils/validationMessages.js"

export const createTilaus = (tilauspvm, hinta, tila = 'vahvistamaton') => {
    if (!tilauspvm, !hinta) throw new Error(missingParams);

    return {
        text: `
            INSERT INTO keskusdivari.Tilaus (tilauspvm, hinta, tila)
            VALUES ($1, $2, $3)
            RETURNING *;
        `,
        values: [tilauspvm, hinta, tila],
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