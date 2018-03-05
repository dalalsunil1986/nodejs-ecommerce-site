const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StripeTransactionSchema = new Schema({
  stripeDetails: {},
  userInfo: {},
  cartContents: []
}, {
  timestamps: true
});



var StripeTransaction = mongoose.model('StripeTransaction', StripeTransactionSchema);

module.exports = StripeTransaction;
