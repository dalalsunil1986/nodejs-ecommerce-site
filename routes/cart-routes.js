const Express = require('express');
const router = Express.Router();

const _ = require('lodash');

const {
  Product,
  Category,
  User,
  sequelize,
  Sequelize: {Op}  //destructuring: Op = Sequelize.Op  ... makes query operators available
  }  = require('../models/sequelize');

const sqlData = require('../services/sequelize/sequelize-data');

const _buildCartContentsFromSession = (req) => {
  const currentCart = req.session.cart || [];
  // gets the list of product ids in the cart
  const cartList = currentCart.map(item => item.id);
  return sqlData.getProductsByList(cartList)
  .then(cart => {
    // reduces cart into an object with item.id as keys
    const cartMap = cart.reduce((map, item) => {
      map[item.id] = item;
      return map;
    }, {});
    // maps cart back into an array and adds current item quantities
    const cartWithQty = currentCart.map(cartItem => {
      cartMap[cartItem.id].quantity = cartItem.quantity || 0; 
      return cartMap[cartItem.id];
    });
    console.log("cartWithQty");
    console.log(cartWithQty);
    // returns a then-able array
    return cartWithQty;
  });
};

// SHOW CART CONTENTS
// ----------
// router.get('/', (req, res) => {
//   _buildCartContentsFromSession(req)
//   .then(cartWithQty => {
//     res.render('cart/cart-index', {
//         cart: cartWithQty
//     });
//   });
// });

// // SHOW CHECKOUT PAGE
// // ----------
// router.get('/checkout', (req, res) => {
//   _buildCartContentsFromSession(req)
//   .then(cartWithQty => {
//     res.render('cart/cart-checkout', {
//       cart: cartWithQty
//     });
//   });  
// });

// CLEAR ONE ITEM OR CLEAR THE FULL CART CONTENTS
// ----------
router.post('/clear', (req, res) => {
  if (req.body.clear === "all") {
    delete req.session.cart;
  } else {
    req.session.cart = req.session.cart.filter(item => {
      return item.id !== req.body.clear;
    });  
  }
  res.redirect('/cart');
});

// SHOW CART *OR* CHECKOUT PAGE 
// ----------
router.get(['/', '/checkout'], (req, res) => {
  
  // chooses the handlebars template based on the path
  const templateName = {
    '/': 'cart/cart-index',
    '/checkout': 'cart/cart-checkout'
  }[req.path];
  
  // gets the cart contents
  _buildCartContentsFromSession(req)
  .then(cartWithQty => {
  
  // renders the chosen template with the cart contents
    res.render(templateName, {
      cart: cartWithQty
    });
  });  
});

// ADD OR UPDATE AN ITEM IN THE CART CONTENTS
// - still needs to remove items based on negative quantities
// - check how quantities are added from the products page
// - add "edit in cart" function to product page
// ----------
router.post('/:itemId', (req, res) => {
  req.session.cart = req.session.cart || [];
  let itemIndex = req.session.cart.findIndex(cartItem => {
    return cartItem.id === req.params.itemId;
  });
  if (itemIndex >= 0) {
    req.session.cart[itemIndex].quantity = Number(req.body.quantity);
  } else {
    req.session.cart.push({
      id: req.params.itemId,
      quantity: Number(req.body.quantity)
    });
  }
  req.flash('notify', 'Added to cart');
  req.method = "GET";
  res.redirect('back');
});

module.exports = router;
