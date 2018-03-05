
// BLUEBIRD
// ----------
const bluebird = require('bluebird');

// MONGOOSE
// ----------
const mongoose = require('mongoose');
mongoose.Promise = bluebird;

var models = {};
models.StripeTransaction = require('./stripe-transactions');



module.exports = models;