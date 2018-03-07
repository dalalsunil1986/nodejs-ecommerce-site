var {StripeTransaction} = require('../models/mongoose');

var mongoData = {};
mongoData.allTransactions = () => {
  console.log("inside allTransactions");
  return StripeTransaction.find()
  .then(all => {
    console.log(all);
    return all;
  });
};
mongoData.transaction = (id) => {
  return StripeTransaction.findById(id);
};

module.exports = mongoData;
