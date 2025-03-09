import { invalidId, invalidISBN, invalidNumericValue, missingParams } from "../utils/validationMessages";
import { validateISBN } from "../utils/validators";

export const createTeos = (isbn = null, nimi, tekija, hinta, paino, tyyppiId = null, luokkaId = null) => {
    if (isbn && !validateISBN(isbn) || !isbn || !nimi || !tekija || !hinta || isNaN(hinta) || !paino || isNaN(paino)) throw new Error(missingParams);
    return {
        text: `
            INSERT INTO Teos (isbn, nimi, tekija, hinta, paino, tyyppiId, luokkaId)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `,
        values: [isbn, nimi, tekija, hinta, paino, tyyppiId, luokkaId],
    };
};

export const getTeosWithNideCount = (id) => {
    if (!id || isNaN(id)) throw new Error(invalidId);
    return {
        text: `
            SELECT t.*, COALESCE(COUNT(n.id), 0) AS kpl 
            FROM Teos t
            LEFT JOIN Nide n ON t.id = n.teosId
            WHERE t.id = $1
            GROUP BY t.id;
        `,
        values: [id],
    };
};

export const getAllTeoksetWithNideCount = () => {
    return {
        text: `
            SELECT t.*, COALESCE(COUNT(n.id), 0) AS kpl 
            FROM Teos t
            LEFT JOIN Nide n ON t.id = n.teosId
            GROUP BY t.id;
        `,
    };
};

export const updateTeos = (id, isbn, nimi = null, tekija = null, hinta = null, paino = null, tyyppiId, luokkaId) => {
    if (!id || isNaN(id)) throw new Error(invalidId);
    if (isbn && !validateISBN(isbn)) throw new Error(invalidISBN);
    if ((paino && isNaN(paino)) || (hinta && isNaN(hinta))) throw new Error(invalidNumericValue);
    return {
        text: `
            UPDATE Teos
            SET isbn = $1,
                nimi = COALESCE($2, nimi),
                tekija = COALESCE($3, tekija),
                hinta = COALESCE($4, hinta),
                paino = COALESCE($5, paino),
                tyyppiId = $6,
                luokkaId = $7
            WHERE id = $8
            RETURNING *;
        `,
        values: [isbn, nimi, tekija, hinta, paino, tyyppiId, luokkaId, id],
    };
};

export const deleteTeos = (id) => {
    if (!id || isNaN(id)) throw new Error(invalidId);
    return {
        text: `
            DELETE FROM Teos
            WHERE id = $1
            RETURNING *;
        `,
        values: [id],
    };
};