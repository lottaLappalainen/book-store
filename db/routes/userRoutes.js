import backend, {pool} from "../../backend.js";
import * as q from '../queries/kayttajaCRUD.js'
/* -------------------------------------------------------------------------- */
/*                                  Käyttäjä                                  */
/* -------------------------------------------------------------------------- */

/* ----------------------------- Create Käyttäjä ---------------------------- */
backend.post('/api/kayttaja', async (req, res) => {
    const { nimi, osoite, sposti, puh, salasana, rooli } = req.body;

    try {
        const queryData = q.createKayttaja(
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
app.get('api/kayttaja', async (req, res) => {
    
    try {
        const queryData = q.getAllKayttajat();
        const result = await pool.query(queryData.text);
        res.status(200).json(result.rows);    
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/* ----------------------------- Update Käyttäjä ---------------------------- */
app.put('/api/kayttaja/:id', async (req, res) => {
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