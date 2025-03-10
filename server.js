import cors from 'cors';
import 'dotenv/config';
import app from './app.js';

function start() {
    const port = process.env.PORT || 5000;

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
};

start();