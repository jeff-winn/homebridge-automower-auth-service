import express from 'express';

/**
 * Defines the default server port.
 */
const DEFAULT_SERVER_PORT = 8080;

const app = express();
const port = process.env.PORT ?? DEFAULT_SERVER_PORT;

app.get('/api/v1/authorize/:id', (req, res) => {
    const code = req.query.code;
    const state = req.query.state;

    const body = JSON.stringify({
        id: req.params.id,
        code: code,
        state: state,
    });

    res.send(body);
});

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});