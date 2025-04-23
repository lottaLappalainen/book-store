import { pool } from "../../backend.js";
import * as q from '../queries/tilausQueries.js';

export const setupTilausRoutes = (backend) => {

    backend.post('/api/tilaa', async (req, res) => {
        const {userId, items} = req.body; 
        console.log("here");
        console.log(userId);
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
            const q2 = q.createTilaus(new Date(), price, 'vahvistamaton', userId);
            const order = (await pool.query(q2.text, q2.values)).rows;

            const response = {
                ...order[0],
                niteet: niteet,
            };
            res.status(200).json(response);
    
        } catch (error) {
           await pool.query('ROLLBACK');
           res.status(400).json({ error: error.message }); 
        }
    });

    backend.post('/api/vahvista', async (req, res) => {
        const { id, niteet, shipments } = req.body;
        
        try {
            //päivitä niteet myydyiksi
            for (let i = 0; i<niteet.length; i++) {
                const q1 = q.sellNide(id, niteet[i].id);
                await pool.query(q1.text, q1.values);

            };

            for (let i = 0; i<shipments.length; i++) {
                const currShipment = shipments[i];
                //luo lähetys
        
                console.log("id", id)
                const q2 = q.createLahetys(currShipment.postikulut, id);
                await pool.query(q2.text, q2.values);  
            };

            //päivitä tilaus maksetuksi
            const q3 = q.getTilausForUpdate(id);
            const order = (await pool.query(q3.text, q3.values)).rows[0];
            const q4 = q.updateTilaus(order.id, order.tilauspvm, order.hinta, 'maksettu');
            await pool.query(q4.text, q4.values);

            await pool.query('COMMIT');
            res.status(200).json("Tilaus hyväksytty");
        } catch (error) {
            await pool.query('ROLLBACK');
            res.status(400).json({ error: error.message });
        };
    });

    backend.post('/api/hylkaa', async (req, res) => {
        const {id, niteet} = req.body;
        
        console.log(id);
        console.log(niteet);
        try {
            for (let i = 0; i < niteet.length; i++) {
                const queryData = q.releaseNide(niteet[i].id);
                await pool.query(queryData.text, queryData.values);
            }
            const q2 = q.deleteTilaus(id);
            await pool.query(q2.text, q2.values);
            await pool.query('COMMIT');
            res.status(200).json("Tilaus peruttu");
        } catch (error) {
            await pool.query('ROLLBACK');
            res.status(400).json({ error: error.message });
        };
    });
};