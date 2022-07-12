import express from 'express';
import session from 'express-session';
import { config } from 'dotenv';
import { v4 as uuid } from 'uuid';

// config();

declare module 'express-session' {
    interface Session {
        userId: string;
    }
}

const app = express();
app.disable('x-powered-by'); // S5689

const port = process.env.PORT ?? 3000;
const redirectUri = process.env.REDIRECT_URI!;
const clientId = process.env.CLIENT_ID!;
const clientSecret = process.env.CLIENT_SECRET!;

const oauthUrl = 'https://api.authentication.husqvarnagroup.dev/v1/oauth2/authorize';

app.use(session({
    secret: uuid(),
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: { secure: true, httpOnly: true }        
}));

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.get('/oauth/login/:id', (req, res) => {
    req.session.userId = req.params.id;

    const redirect = encodeURI(redirectUri);
    res.redirect(`${oauthUrl}?client_id=${clientId}&redirect_uri=${redirect}`);
});

app.get('/oauth/notify', (req, res) => {
    const code = req.query.code;
    const state = req.query.state;
    const id = req.session.userId;

    console.log(`[${id}] Code: ${code}`);
    console.log(`[${id}] State: ${state}`);
    
    res.redirect('/oauth/success');
});

app.get('/oauth/success', (req, res) => {
    res.send('Got it! You can close this page.');
});

app.listen(port, () => {        
    console.log(`Server listening on port: ${port}`);
});