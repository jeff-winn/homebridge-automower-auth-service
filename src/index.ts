import express from 'express';
import session from 'express-session';
import nconf from 'nconf';

import { v4 as uuid } from 'uuid';
import { config } from 'dotenv';

declare module 'express-session' {
    interface Session {
        userId: string;
    }
}

config();

nconf.argv().env()
    .file('default', { file: './config/default.json' })
    .file('env', { file: `./config/${process.env.NODE_ENV}.json` });

const app = express();
app.disable('x-powered-by'); // S5689

const port = process.env.PORT || 3000;
const redirectUri = nconf.get('redirectUri');
const prod = nconf.get('production');

app.use(session({
    secret: uuid(),
    resave: false,
    saveUninitialized: false,
    proxy: prod,
    cookie: { secure: prod, httpOnly: true }        
}));

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.get('/oauth/login/:id', (req, res) => {
    req.session.userId = req.params.id;

    res.redirect(`${nconf.get('oauthUrl')}?client_id=${nconf.get('CLIENT_ID')}&redirect_uri=${encodeURI(redirectUri)}`);
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
    console.log(`PWD: ${process.env.PWD}`);
    console.log(`Server listening on port: ${port}`);
});