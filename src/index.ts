import express from 'express';
import { v4 as uuid } from 'uuid';

/**
 * Defines the default server port.
 */
const DEFAULT_SERVER_PORT = 8080;

const app = express();
const port = process.env.PORT ?? DEFAULT_SERVER_PORT;

app.get('/api/v1/authorize/:id', (req, res) => {
    const code = req.query.code;
    const state = req.query.state;

    const id = uuid();
    console.log(`[${id}] Code: ${code}`);
    console.log(`[${id}] State: ${state}`);
    
    // const body = JSON.stringify({
    //     id: req.params.id,
    //     code: code,
    //     state: state,
    // });

    res.send('Got it! You can close this page.');
});

app.listen(port, () => {        
    console.log(`Server listening on port: ${port}`);
});