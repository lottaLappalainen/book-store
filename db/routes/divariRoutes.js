import { pool } from "../../backend.js";
import * as q from "../queries/divariCRUD.js";

export const setupDivariRoutes = (backend) => {
    /* -------------------------------------------------------------------------- */
    /*                                   Divari                                   */
    /* -------------------------------------------------------------------------- */

    /* ------------------------------ Create Divari ----------------------------- */
    backend.post("/api/keskusdivari/divari", async (req, res) => {
        const { nimi, osoite, omaTietokanta } = req.body;

        try {
            const queryData = q.createDivari(nimi, osoite, omaTietokanta);
            const result = await pool.query(queryData.text, queryData.values);
            res.status(201).json(result.rows[0]);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    /* ------------------- Create Divari with Oma Tietokanta -------------------- */
    backend.post("/api/divari/oma-tietokanta", async (req, res) => {
        const { nimi, osoite } = req.body;
        try {
            const divariInfoQuery = q.createDivariInfo(nimi, osoite);
            const result = await pool.query(divariInfoQuery.text, divariInfoQuery.values);
            res.status(201).json(result.rows[0]);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    /* ------------------------------- Get Divari ------------------------------- */
    backend.get("/api/keskusdivari/divari/:id", async (req, res) => {
        const { id } = req.params;

        try {
            const queryData = q.getDivari(id);
            const result = await pool.query(queryData.text, queryData.values);
            res.status(200).json(result.rows[0]);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    /* ----------------------------- Get All Divarit ---------------------------- */
    backend.get("/api/keskusdivari/divarit", async (req, res) => {
        try {
            const queryData = q.getAllDivarit();
            const result = await pool.query(queryData.text);
            res.status(200).json(result.rows);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    /* ----------------------------- Get All DivariInfo ------------------------- */
    backend.get("/api/divari/divariinfo", async (req, res) => {
        try {
            const queryData = q.getAllDivariInfo();
            const result = await pool.query(queryData.text);
            res.status(200).json(result.rows);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    /* ------------------------------ Update Divari ----------------------------- */
    backend.put("/api/keskusdivari/divari/:id", async (req, res) => {
        const { id } = req.params;
        const { nimi, osoite, omaTietokanta } = req.body;

        try {
            const queryData = q.updateDivari(id, nimi, osoite, omaTietokanta);
            const result = await pool.query(queryData.text, queryData.values);
            res.status(200).json(result.rows[0]);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    /* ------------------------------ Delete Divari ----------------------------- */
    backend.delete("/api/keskusdivari/divari/:id", async (req, res) => {
        const { id } = req.params;

        try {
            const queryData = q.deleteDivari(id);
            const result = await pool.query(queryData.text, queryData.values);
            res.status(200).json(result.rows[0]);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
};