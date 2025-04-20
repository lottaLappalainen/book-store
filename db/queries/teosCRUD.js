import { invalidId, invalidISBN, invalidNumericValue, missingParams } from "../../utils/validationMessages.js";
import { validateISBN } from "../../utils/validators.js";

// T2
export const createTeosForDivari = (isbn, nimi, tekija, hinta, julkaisuvuosi, paino, tyyppiId, luokkaId, divariId) => {
    if (!nimi || !tekija || !hinta || isNaN(hinta) || !julkaisuvuosi || isNaN(julkaisuvuosi) || !paino || isNaN(paino)) {
        throw new Error("Missing or invalid parameters.");
    }
    if (isbn && !validateISBN(isbn)) {
        throw new Error("Invalid ISBN.");
    }

    return {
        text: `
            WITH inserted_teos AS (
                INSERT INTO keskusdivari.Teos (isbn, nimi, tekija, hinta, julkaisuvuosi, paino, tyyppiId, luokkaId)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                ON CONFLICT (isbn) DO NOTHING
                RETURNING id
            )
            INSERT INTO divari.Teos (isbn, nimi, tekija, hinta, julkaisuvuosi, paino, tyyppiId, luokkaId, divariId)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (nimi, tekija) DO NOTHING
            RETURNING id;
        `,
        values: [isbn || null, nimi, tekija, hinta, julkaisuvuosi, paino, tyyppiId || null, luokkaId || null, divariId],
    };
};


// T3
export const addTeosToDivari = (teosId, divariId, ostohinta) => {
    if (!teosId || isNaN(teosId)) throw new Error("Invalid Teos ID.");
    if (!divariId || isNaN(divariId)) throw new Error("Invalid Divari ID.");
    if (!ostohinta || isNaN(ostohinta) || ostohinta <= 0) throw new Error("Invalid purchase price.");

    return {
        text: `
            INSERT INTO keskusdivari.Nide (teosId, divariId, ostohinta, tila)
            VALUES ($1, $2, $3, 'vapaa')
            RETURNING id, teosId, divariId, ostohinta, tila;
        `,
        values: [teosId, divariId, ostohinta],
    };
};

// Get book by id with copy count
export const getTeosWithNideCount = (id) => {
    if (!id || isNaN(id)) throw new Error(invalidId);
    return {
        text: `
            SELECT t.*, COALESCE(COUNT(n.id), 0) AS kpl 
            FROM keskusdivari.Teos t
            LEFT JOIN keskusdivari.Nide n ON t.id = n.teosId
            WHERE t.id = $1
            GROUP BY t.id;
        `,
        values: [id],
    };
};

// Get all books with their copy counts
export const getAllTeoksetWithNideCount = () => {
    return {
        text: `
            SELECT t.*, COALESCE(COUNT(n.id), 0) AS kpl 
            FROM keskusdivari.Teos t
            LEFT JOIN keskusdivari.Nide n ON t.id = n.teosId
            GROUP BY t.id;
        `,
    };
};


