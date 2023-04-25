const axios = require('axios');
const express = require('express');
require('dotenv').config();
import qs from 'query-string';

const app = express();
const PORT = 8000;
const REDIRECT_URI = 'http://localhost:8000/callback';

app.get('/', (_req, res) => {
  res.send('Request received.');
});

app.get('/login', (_req, res) => {
  const state = Math.random();
  const scope = 'user-read-private user-read-email';

  res.redirect('https://accounts.spotify.com/authorize?' +
    qs.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope,
      redirect_uri: REDIRECT_URI,
      state,
    }));
});

app.get('/callback', async (req, res) => {
  const { code, state } = req.query;
  if (state === null) {
    res.redirect('/#' + qs.stringify({ error: 'state_mismatch '}));
  } else {
    const auth_token = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')
    const headers = {
      headers: {
        'Authorization': `Basic ${auth_token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    };
    const params = {
      code,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code'
    };

    const response = await axios.post('https://accounts.spotify.com/api/token',
      qs.stringify(params),
      headers
    );

    res.send(200, { data: response.data });
  }
});

app.listen(PORT, () => {
  return console.log(`Listening on port ${PORT}`);
});
