import * as queryString from 'querystring';
import express from "express";
import cors from 'cors';
import 'dotenv/config';
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import axios from "axios";

const config = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    redirectUrl: process.env.REDIRECT_URL,
    clientUrl: process.env.CLIENT_URL,
    tokenSecret: process.env.TOKEN_SECRET,
    tokenExpiration: 36000,
    postUrl: 'https://jsonplaceholder.typicode.com/posts'
}

const authParams = queryString.stringify({
    client_id: config.clientId,
    redirect_uri: config.redirectUrl,
    response_type: 'code',
    scope: 'openid profile email',
    access_type: 'offline',
    state: 'standard_oauth',
    prompt: 'consent'
})

const getTokenParams = (code) => queryString.stringify({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    grant_type: 'authorization_code',
    redirect_uri: config.redirectUrl,
});


const app = express();

app.use(cors({
    origin: [
        config.clientUrl,
    ],
    credentials: true,
}));

app.use(cookieParser());

const auth = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token) return res.status(401).json({message: 'unauthorized'});

        jwt.verify(token, config.tokenSecret);
        return next();
    } catch( err ) {
        console.error('Error: ', err);
        res.status(401).json({ message: "Unauthorized"});
    }
}

app.get('/auth/url', (req, res) => {
    res.json({
        url: `${config.authUrl}?${authParams}`,
    })
})

app.get('/auth/token', async (req, res) => {
    const { code } = req.query;
    if (!code) return res.status(400).json({ message: 'Authorization code must be provided'});
    try {
        const tokenParam = getTokenParams(code);

        const { data: { id_token }} = await axios.post(`${config.tokenUrl}?${tokenParam}`);

        if (!id_token) return res.status(400).json({ message: 'Auth error'});

        const { email, name, picture} = jwt.decode(id_token);

        const user = {name, email, picture};
        const token = jwt.sign({ user }, config.tokenSecret, {expiresIn: config.tokenExpiration});

        res.cookie('token', token, { maxAge: config.tokenExpiration, httpOnly: true});

        res.json({user});
    } catch( err) {
        console.error('Error: ', err);
        res.status(500).json({ message: err.message || 'Server error' });
    }
})

app.get('/auth/logged_in', (req, res) => {
    try {
        const  token = req.cookies.token;
        if( !token) return res.json( {loggedIn: false});
        const { user } = jwt.verify(token, config.tokenSecret);
        const newToken = jwt.sign({user}, config.tokenSecret, { expiresIn: config.tokenExpiration});

        res.cookie('token', newToken, { maxAge: config.tokenExpiration, httpOnly: true});
        res.json({ loggedIn: true, user});
    } catch (err) {
        res.json( { loggedIn: false});
    }
})

app.post('/auth/logout', (_, res) => {
    res.clearCookie('token').json({ message: 'Logged out'});
})

app.get('/user/posts', auth, async (_, res) => {
    try {
        const { data} = await axios.get(config.postUrl);
        res.json({posts: data?.slice(0,5)});
    } catch (err) {
        res.status(500).json({message: 'message error'});
    }
})

const PORT = process.env.PORT || 5001;
app.listen(PORT, ()=> console.log(`server listening on port ${PORT}`));