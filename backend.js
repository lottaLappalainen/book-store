import express from 'express';
import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
    console.log('Connected to postgresql database');
});


const backend = express();

backend.use(express.json());

backend.get('/', (req, res) => {
    res.send('hello')
});

export default backend;