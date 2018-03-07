var Express = require('express');
var router = Express.Router();

var mongoData = require('../services/mongoose-queries');

router.use((req, res, next) => {
  // add admin user auth
  console.log("admin middleware");
  next();
});

router.get('/', (req, res) => {
  console.log("redirecting to /admin");
  res.redirect('/admin/orders');
});

router.get('/orders', (req, res) => {
  console.log("calling transactions");
  mongoData.allTransactions()
  .then(all => {
    console.log("all transactions");
    console.log(all);
    res.render('admin/admin-orders-index', {
      transactions: all
    });
  });
});

router.get('/orders/:transactionId', (req, res) => {
  mongoData.transaction(req.params.transactionId)
  .then(transaction => {
    res.render('admin/admin-order-page', {
      transaction: transaction
    });
  });
});

module.exports = router;
