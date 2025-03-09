import express from 'express';
import { pool } from './db';
import cors from 'cors';
import { 
    createTeos, 
    getTeosWithNideCount,
    getAllTeoksetWithNideCount,
    updateTeos,
    deleteTeos,
    createKayttaja, 
    getKayttaja,
    getAllKayttajat,
    updateKayttaja,
    deleteKayttaja,
} from './queries';


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* -------------------------------------------------------------------------- */
/*                                  Käyttäjä                                  */
/* -------------------------------------------------------------------------- */

/* ----------------------------- Create Käyttäjä ---------------------------- */
app.post('/api/kayttaja', async (req, res) => {
    const { nimi, osoite, sposti, puh, salasana, rooli } = req.body;

    try {
        const queryData = createKayttaja(
            nimi,
            osoite,
            sposti,
            puh ?? null,
            salasana,
            rooli
        );
        const result = await pool.query(queryData.text, queryData.values);
        response.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/* ------------------------------ Get Käyttäjä ------------------------------ */
app.get('/api/kayttaja/:id', async (req, res) => {
    const { id } = req.body;

    try {
        const queryData = getKayttaja(id);
        const result = await pool.query(queryData.text, queryData.values);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/* ---------------------------- Get all Käyttäjät --------------------------- */
app.get('/api/kayttaja', async (req, res) => {
    
    try {
        const queryData = getAllKayttajat();
        const result = await pool.query(queryData.text);
        res.status(200).json(result.rows);    
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/* ----------------------------- Update Käyttäjä ---------------------------- */
app.put('/api/kayttaja/:id', async (req, res) => {
    const { id } = req.body;

    try {
        const queryData = updateKayttaja(id);
        const result = await pool.query(queryData.text, queryData.values);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/* ----------------------------- Delete Käyttäjä ---------------------------- */
app.delete('/api/kayttaja/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const queryData = deleteKayttaja(id);
        const result = await pool.query(queryData.text, queryData.values);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/* -------------------------------------------------------------------------- */
/*                                    Teos                                    */
/* -------------------------------------------------------------------------- */

/* ------------------------------- Create Teos ------------------------------ */
app.post('/api/teos', async (req, res) => {
    const { isbn, nimi, tekija, hinta, paino, tyyppiId, luokkaId } = req.body;
    
    try {
        const queryData = createTeos(isbn, nimi, tekija, hinta, paino, tyyppiId, luokkaId);
        const result = await pool.query(queryData.text, queryData.values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/* -------------------------------- Get Teos -------------------------------- */
app.get('/api/teos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const queryData = getTeosWithNideCount(id);
        const result = await pool.query(queryData.text, queryData.values);
        res.status(200).json(result.rows[0]);  
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/* ----------------------------- Get all Teokset ---------------------------- */
app.get('/api/teos', async (req, res) => {
    
    try {
        const queryData = getAllTeoksetWithNideCount();
        const result = await pool.query(queryData.text);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/* ------------------------------- Update Teos ------------------------------ */
app.put('/api/teos/:id', async (req, res) => {
    const { id } = req.params;
    const { isbn, nimi, tekija, hinta, paino, tyyppiId, luokkaId } = req.body;

    try {
        const queryData = updateTeos(id, isbn, nimi, tekija, hinta, paino, tyyppiId, luokkaId);
        const result = await pool.query(queryData.text, queryData.values);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/* ------------------------------- Delete Teos ------------------------------ */
app.delete('/api/teos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const queryData = deleteTeos(id);
        const result = await pool.query(queryData.text, queryData.values);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});