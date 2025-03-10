import backend, { pool } from "../../backend.js";
import * as q from '../queries/teosCRUD.js';

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

