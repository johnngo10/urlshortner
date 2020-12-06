require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const Url = require('./models/Url');
const nanoid = require('nanoid');

// Setup mongodb connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(result => console.log('connected to db'))
  .catch(err => console.log(err));

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.use(express.urlencoded({ extended: false }));

app.post('/api/shorturl/new', function (req, res) {
  const fullUrl = req.body.url;
  const shortUrl = nanoid.nanoid(10);
  const regex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

  if (!regex.test(fullUrl)) {
    res.json({
      error: 'invalid url',
    });
  } else {
    const record = new Url({
      url: fullUrl,
      hash: shortUrl,
    });

    record
      .save()
      .then(result => {
        res.json({
          original_url: fullUrl,
          short_url: shortUrl,
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
});

app.get('/api/shorturl/:short_url', function (req, res) {
  const shortUrl = req.params.short_url;

  const findShortUrl = Url.findOne({ hash: shortUrl }, function (err, data) {
    if (!data) {
      res.json({
        error: 'No short URL found',
      });
    } else {
      res.redirect(data.url);
    }
  });
});

// Basic Configuration
const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
