import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT
});

pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

const backend = express();
const port = process.env.SERVER_PORT || 3000; // 8069?

backend.use(express.json());
backend.use(cors()); // Enable CORS for all routes

// Define a simple route to test the server
backend.get('/', (req, res) => {
    res.send('hello');
});

// Import and use routes
import { setupUserRoutes } from './db/routes/userRoutes.js';
setupUserRoutes(backend);

backend.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

backend.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

export default backend;