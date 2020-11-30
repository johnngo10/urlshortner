require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const shortUrl = require('./models/shorturl');

// Setup mongodb connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => console.log('connected to db'))
  .catch((err) => console.log(err));

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.use(express.urlencoded({extended: false}))

app.post('/api/shorturl/new', function(req, res) {
  const fullUrl = req.body.url;
  console.log(`Requested URL: ${fullUrl}`);

  const record = new shortUrl({
    original_url: fullUrl
  })
})

// Basic Configuration
const port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
