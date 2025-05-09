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
    port: process.env.PORT,
    max: 20
});

pool.connect()
    .then(() => console.log('✅ Connected to PostgreSQL database'))
    .catch(err => console.error('❌ Failed to connect to database:', err.message));

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

const backend = express();
const port = process.env.VITE_SERVER_PORT;

backend.use(express.json());
backend.use(cors()); // Enable CORS for all routes

// Define a simple route to test the server
backend.get('/', (req, res) => {
    res.send('hello');
});

// Import and use routes
import { setupUserRoutes } from './db/routes/userRoutes.js';
setupUserRoutes(backend);
import { setupTeosRoutes } from './db/routes/teosRoutes.js';
setupTeosRoutes(backend);
import { setupTilausRoutes } from './db/routes/tilausRoutes.js';
setupTilausRoutes(backend);
import { setupDivariRoutes } from './db/routes/divariRoutes.js';
setupDivariRoutes(backend);
import { setupXmlRoutes } from './db/routes/xmlRoutes.js';
setupXmlRoutes(backend);

import { setupUtils } from './db/routes/utilRoutes.js';
setupUtils(backend);

backend.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

export default backend;