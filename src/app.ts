const axios = require('axios');
const express = require('express');

const app = express();
const PORT = 3000;

app.get('/', (_req, res) => {
  res.send('Request received.');
});

app.listen(PORT, () => {
  return console.log(`Listening on port ${PORT}`);
});
