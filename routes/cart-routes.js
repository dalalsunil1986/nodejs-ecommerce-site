const Express = require('express');
const router = Express.Router();

const mongoose = require('mongoose');
const models = require('../models/mongoose');
const {StripeTransaction} = models;

const moment = require('moment');

var {
  STRIPE_SK,
  STRIPE_PK
} = process.env;  

var stripe = require('stripe')(STRIPE_SK);

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

// MIDDLEWARE: CART PAGE 
// Reduces db calls by saving product details to req.session.cart
// Implies that /cart must always load at least once before /cart/checkout
// ----------
router.use('/', (req, res, next) => {
  if (req.session.cart && req.session.cart != {}) {
    _buildCartContentsFromSession(req)
    .then(cartWithQty => {
      req.session.cart = cartWithQty;
    });
  }
  next();
});

// MIDDLEWARE: CHECKOUT PAGE 
// Saving POSTed data, making it available for subsequent GETs of the same route
// ----------
router.use('/checkout', (req, res, next) => {
  res.locals.STRIPE_PK = STRIPE_PK; 
  if (req.body.user && req.body.user != {}) {
    req.session.user = req.body.user;
  }
  console.log("req.session.user");
  console.log(req.session.user);
  if (req.session.user && req.session.user != {}) {
    res.locals.userInfo = req.session.user;
    res.locals.gotUserInfo = true;
  }
  console.log("res.locals");
  console.log(res.locals);
  next();
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
  // _buildCartContentsFromSession(req)
  // .then(cartWithQty => {
  
  // renders the chosen template with the cart contents
  res.render(templateName, {
    // cart: cartWithQty
    cart: req.session.cart
  });
});  

// RECEIVING USER DATA TO INITIATE TRANSACTION
// ----------
router.post('/checkout', (req, res) => {
  res.redirect('/cart/checkout');
});

// RECEIVING STRIPE TRANSACTIONS
// ----------
router.post('/charges', (req, res) => {
  var post = req.body;
  var cart = req.session.cart;
  var user = req.session.user;
  stripe.charges.create({
    amount: cart.reduce((sum, item) => sum + (item.price*item.quantity), 0),
    currency: 'usd',
    description: user.firstName+" "+user.lastName+" - "+moment(Date.now()).format("YYYY M D"),
    source: post.stripeToken
  })
  .then((charge) => {
    console.log(charge);
    return new StripeTransaction({
      stripeDetails: {
        stripeToken: post.stripeToken,
        stripeTokenType: charge.source.object,
        stripeCardType: charge.source.brand,
        stripeEmail: charge.source.name
      },
      userInfo: user,
      cartContents: cart 
    });
  })
  .then((transaction) => {
    // Redirect or render here
    res.redirect('home');
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
