import cors from 'cors';
import express from 'express';
import SpotifyWebApi from 'spotify-web-api-node';
require('dotenv').config();

const app = express();
const PORT = 8000;

const corsOptions = {
  origin: process.env.FRONTEND_BASE_URL
}

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

spotifyApi.clientCredentialsGrant().then((data) => {
  spotifyApi.setAccessToken(data.body['access_token'])
});

app.get('/', cors(corsOptions), (_req, res) => {
  res.send('Request received.');
});

app.get('/access-token', cors(corsOptions), (_req, res) => {
  res.send(spotifyApi._credentials.accessToken)
});

app.get('/artists/:searchTerm', cors(corsOptions), (req, res) => {
  const query = req.params.searchTerm;
  spotifyApi.searchArtists(query).then((data) => {
    res.send(data.body.artists)
  });
});

app.get('/artists/tracks/:artistId', cors(corsOptions), (req, res) => {
  const artistId = req.params.artistId;
  spotifyApi.getArtistTopTracks(artistId, 'US').then((data) => {
    res.send(data.body.tracks);
  });
});

app.listen(PORT, () => {
  return console.log(`Listening on port ${PORT}`);
});
