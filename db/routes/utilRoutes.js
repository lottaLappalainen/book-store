import { syncTeosAndNide } from '../utils/t7.js';
import * as q from '../queries/utilQueries.js';
import { pool } from '../../backend.js';

export const setupUtils = (backend) => {
    backend.get('/api/sync', async (req, res) => {
      // run t7.js
      try {
        const sync = await syncTeosAndNide();
        res.status(200).json(sync);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });

    backend.get('/api/postikulut', async (req, res) => {
      try {
        const queryData = q.getPostikulutaulukko();
        const result = await pool.query(queryData.text);
        return res.status(200).json(result.rows);
      } catch (error) {
        res.status(400).json({ error: error.message });
      };
    });

    /* --------------------------- Get Unique "Tyypit" -------------------------- */
    backend.get('/api/tyypit', async (req, res) => {
      try {
          const queryData = q.getTyypit();
          const result = await pool.query(queryData.text);
          res.status(200).json(result.rows);
      } catch (error) {
          res.status(400).json({ error: error.message });
      }
  });

    /* --------------------------- Get Unique "Luokat" -------------------------- */
    backend.get('/api/luokat', async (req, res) => {
        try {
            const queryData = q.getLuokat();
            const result = await pool.query(queryData.text);
            res.status(200).json(result.rows);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    backend.get('/api/kayttajatilaukset', async (req, res) => {
      try {
        const queryData = q.getUsersLastYearOrders();
        const result = await pool.query(queryData.text);
        res.status(200).json(result.rows);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });
};
