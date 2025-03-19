import { pool } from "../../backend.js";
import * as q from '../queries/teosCRUD.js';

export const setupTeosRoutes = (backend) => {
    /* -------------------------------------------------------------------------- */
    /*                                    Teos                                    */
    /* -------------------------------------------------------------------------- */

    /* ------------------------------- Create Teos ------------------------------ */
    backend.post('/api/teos', async (req, res) => {
        const { isbn, nimi, tekija, hinta, paino, tyyppiId, luokkaId } = req.body;

        try {
            const queryData = q.createTeos(isbn, nimi, tekija, hinta, paino, tyyppiId, luokkaId);
            const result = await pool.query(queryData.text, queryData.values);
            res.status(201).json(result.rows[0]);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    /* ------------------ Create Teos Keskusdivariin ja d1 ---------------------- */
    backend.post('/api/divari/teos', async (req, res) => {
        const { isbn, nimi, tekija, hinta, paino, tyyppiId, luokkaId, divariId } = req.body;
    
        try {
            const queryData = q.createTeosForDivari(isbn, nimi, tekija, hinta, paino, tyyppiId, luokkaId, divariId);
            const result = await pool.query(queryData.text, queryData.values);
            res.status(201).json(result.rows[0]);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    /* ------------------------------ Add Teos d2 ------------------------------ */
    backend.post('/api/divari/nide', async (req, res) => {
        const { teosId, divariId, ostohinta } = req.body;
    
        try {
            const queryData = q.addTeosToDivari(teosId, divariId, ostohinta);
            const result = await pool.query(queryData.text, queryData.values);
            res.status(201).json(result.rows[0]);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
    

    /* -------------------------------- Get Teos -------------------------------- */
    backend.get('/api/teos/:id', async (req, res) => {
        const { id } = req.params;

        try {
            const queryData = q.getTeosWithNideCount(id);
            const result = await pool.query(queryData.text, queryData.values);
            res.status(200).json(result.rows[0]);  
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    /* ----------------------------- Get all Teokset ---------------------------- */
    backend.get('/api/teos', async (req, res) => {
        try {
            const queryData = q.getAllTeoksetWithNideCount();
            const result = await pool.query(queryData.text);
            res.status(200).json(result.rows);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    /* ------------------------------- Update Teos ------------------------------ */
    backend.put('/api/teos/:id', async (req, res) => {
        const { id } = req.params;
        const { isbn, nimi, tekija, hinta, paino, tyyppiId, luokkaId } = req.body;

        try {
            const queryData = q.updateTeos(id, isbn, nimi, tekija, hinta, paino, tyyppiId, luokkaId);
            const result = await pool.query(queryData.text, queryData.values);
            res.status(200).json(result.rows[0]);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    /* ------------------------------- Delete Teos ------------------------------ */
    backend.delete('/api/teos/:id', async (req, res) => {
        const { id } = req.params;

        try {
            const queryData = q.deleteTeos(id);
            const result = await pool.query(queryData.text, queryData.values);
            res.status(200).json(result.rows[0]);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    /* --------------------------- Get Unique "Tyypit" -------------------------- */
    backend.get('/api/tyypit', async (req, res) => {
        try {
            const queryData = q.getTyypit();
            const result = await pool.query(queryData.text);
            res.status(200).json(result.rows);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    /* --------------------------- Get Unique "Luokat" -------------------------- */
    backend.get('/api/luokat', async (req, res) => {
        try {
            const queryData = q.getLuokat();
            const result = await pool.query(queryData.text);
            res.status(200).json(result.rows);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
    
};
