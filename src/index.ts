import express from 'express';
import session from 'express-session';

import { v4 as uuid } from 'uuid';

declare module 'express-session' {
    interface Session {
        userId: string;
    }
}

/**
 * Defines the default server port.
 */
const DEFAULT_SERVER_PORT = 8080;

const app = express();
app.disable('x-powered-by'); // S5689

const port = process.env.PORT ?? DEFAULT_SERVER_PORT;

const redirectUri = process.env.REDIRECT_URI!;
const clientId = process.env.CLIENT_ID!;
const clientSecret = process.env.CLIENT_SECRET!;

app.use(session({
    secret: uuid(),
    cookie: { secure: true }        
}));

app.get('/oauth/login/:id', (req, res) => {
    req.session.userId = req.params.id;
    // "https://api.authentication.husqvarnagroup.dev/v1/oauth2/authorize?client_id=<APP KEY>&redirect_uri=<REDIRECT_URI>"

    const redirect = encodeURI(redirectUri);
    res.redirect(`https://api.authentication.husqvarnagroup.dev/v1/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirect}`);
});

app.get('/oauth/notify', (req, res) => {
    const code = req.query.code;
    const state = req.query.state;
    const id = req.session.id;

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