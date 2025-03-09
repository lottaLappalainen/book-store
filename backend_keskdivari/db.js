import 'dotenv/config';
import { Pool } from 'pg';

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.connect()
.then(client => {
    console.log('Connected to database');
    client.release();
})
.catch(e => console.error('Database connection error:', e.stack));

