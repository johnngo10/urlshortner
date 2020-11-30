const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {v5: uuidv5} = require('uuid');

const shortUrlSchema = new Schema({
  url: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true,
    default: uuidv5()
  }
});

const ShortUrl = mongoose.model('ShortUrl', shortUrlSchema);
module.exports = ShortUrl;