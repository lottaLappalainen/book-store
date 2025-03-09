import express from 'express';
import { pool } from './db';
import cors from 'cors';
import { createKayttaja } from './queries';
import { 
    createTeos, 
    getTeosWithNideCount 
} from './queries';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('api/teos', async (req, res) => {
    const { isbn, nimi, tekija, hinta, paino, tyyppiId, luokkaId } = req.body;
    
    try {
        const queryData = createTeos(isbn, nimi, tekija, hinta, paino, tyyppiId, luokkaId);
        const result = await pool.query(queryData.text, queryData.values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('api/teos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const queryData = getTeosWithNideCount(id);
        const result = await pool.query(queryData.text, queryData.values);
        res.status(200).json(result.rows[0]);  
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});