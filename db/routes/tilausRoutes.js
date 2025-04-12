import { pool } from "../../backend.js";
import * as q from '../queries/tilausQueries.js';

export const setupTilausRoutes = (backend) => {

    backend.post('/api/tilaa', async (req, res) => {
        const items = req.body; // items = [{ teosId, quantity, hinta }]
        try {
            //varaa ja hae niteet
            let niteet = [];
            let price = 0;
            for (const { id, quantity, hinta } of items) {
                price += parseFloat(hinta);
                const queryData = q.reserveNiteet(id, quantity);
                const result = await pool.query(queryData.text, queryData.values);
                niteet.push(...result.rows);
            };
            
            //luo tilaus
            const q2 = q.createTilaus(new Date(), price, 'vahvistamaton');
            const order = (await pool.query(q2.text, q2.values)).rows;

            const response = {
                ...order[0],
                niteet: niteet,
            };

            await pool.query('COMMIT');

            res.status(200).json(response);
    
        } catch (error) {
           await pool.query('ROLLBACK');
           res.status(400).json(items)
           //res.status(400).json({ error: error.message }); 
        }
    });
};