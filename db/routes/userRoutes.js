import { pool } from "../../backend.js";
import * as q from '../queries/kayttajaCRUD.js';

export const setupUserRoutes = (backend) => {
    /* -------------------------------------------------------------------------- */
    /*                                  Käyttäjä                                  */
    /* -------------------------------------------------------------------------- */

    /* ----------------------------- Create Käyttäjä ---------------------------- */
    backend.post('/api/register', async (req, res) => {
        const { nimi, osoite, sposti, puh, salasana, rooli } = req.body;

        try {
            // Check if user already exists
            const checkUserQuery = q.getKayttajaByEmail(sposti);
            const checkUserResult = await pool.query(checkUserQuery.text, checkUserQuery.values);

            if (checkUserResult.rows.length > 0) {
                return res.status(400).json({ error: 'User already exists' });
            }

            const queryData = q.createKayttaja(
                nimi,
                osoite,
                sposti,
                puh ?? null,
                salasana,
                rooli
            );

            const result = await pool.query(queryData.text, queryData.values);

            res.status(201).json(result.rows[0]);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    /* ------------------------------ Login Käyttäjä ---------------------------- */
    backend.post('/api/login', async (req, res) => {
        const { sposti, salasana } = req.body;

        try {
            const queryData = q.getKayttajaByEmail(sposti);
            const result = await pool.query(queryData.text, queryData.values);

            if (result.rows.length === 0) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            const kayttaja = result.rows[0];

            if (salasana !== kayttaja.salasana) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            res.status(200).json({ message: 'Login successful', kayttaja });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    /* ------------------------------ Get Käyttäjä ------------------------------ */
    backend.get('/api/kayttaja/:id', async (req, res) => {
        const { id } = req.params;

        try {
            const queryData = q.getKayttaja(id);
            const result = await pool.query(queryData.text, queryData.values);
            res.status(200).json(result.rows[0]);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    /* ---------------------------- Get all Käyttäjät --------------------------- */
    backend.get('/api/kayttaja', async (req, res) => {
        try {
            const queryData = q.getAllKayttajat();
            const result = await pool.query(queryData.text);
            res.status(200).json(result.rows);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    /* ----------------------------- Update Käyttäjä ---------------------------- */
    backend.put('/api/kayttaja/:id', async (req, res) => {
        const { id } = req.params;

        try {
            const queryData = q.updateKayttaja(id);
            const result = await pool.query(queryData.text, queryData.values);
            res.status(200).json(result.rows[0]);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    /* ----------------------------- Delete Käyttäjä ---------------------------- */
    backend.delete('/api/kayttaja/:id', async (req, res) => {
        const { id } = req.params;

        try {
            const queryData = q.deleteKayttaja(id);
            const result = await pool.query(queryData.text, queryData.values);
            res.status(200).json(result.rows[0]);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
};