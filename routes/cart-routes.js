const Express = require('express');
const router = Express.Router();

router.get('/', (req, res) => {
  
});

router.post('/:id', (req, res) => {
  req.session.cart = req.session.cart || [];
  let itemIndex = req.session.cart.findIndex(cartItem => {
    return cartItem.id === req.params.id;
  });
  if (itemIndex >= 0) {
    req.session.cart[itemIndex].quantity += req.body.quantity;
  } else {
    req.session.cart.push({
      id: req.params.id,
      quantity: req.body.quantity
    });
  }
  req.flash('notify', 'Added to cart');
  req.method = "GET";
  res.redirect('back');
});

module.exports = router;
