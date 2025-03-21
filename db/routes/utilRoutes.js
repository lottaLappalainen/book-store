import { syncTeosAndNide } from '../utils/t7.js';

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

};