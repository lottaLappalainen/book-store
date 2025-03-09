import express from 'express';
import helmet from 'helmet';
import { getAllKayttajat } from './db/queries/kayttajaCRUD.js';
import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
    console.log('Connected to postgresql database');
});


const app = express();

app.use(express.json());

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],  // Salli resurssit vain omalta palvelimelta
                scriptSrc: ["'self'",], // Salli skriptit tietyistä lähteistä
                styleSrc: ["'self'", "'unsafe-inline'"], // Salli sisäiset tyylit
                imgSrc: ["'self'", "data:", "https://images.example.com"], // Salli kuvat tietyistä lähteistä
                connectSrc: ["'self'", ], // Salli AJAX/FETCH API-kutsut
                frameSrc: ["'none'"], // Estä iframe-upotukset
            }
        }
    })
);

app.get('/api/kayttajat', async (req, res) => {
    
    try {
        const queryData = getAllKayttajat();
        const result = await pool.query(queryData.text);
        res.status(200).json(result.rows);    
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('hello')
});



export default app;