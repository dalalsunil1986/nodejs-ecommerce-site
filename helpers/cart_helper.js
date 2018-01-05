var {
  STRIPE_SK,
  STRIPE_PK
} = process.env;

var stripe = require('stripe')(STRIPE_SK);

// var _ = require('lodash');

const CartHelper = {};

CartHelper.cartTotal = (cart) => {
  let total = cart.reduce((sum, item) => {
    return sum += item.price * item.quantity;
  }, 0);
  return total.toFixed(2);
};
CartHelper.itemTotal = (price, quantity) => {
  return (price * quantity).toFixed(2);
};
CartHelper.stripePK = () => STRIPE_PK;
CartHelper.isEmpty = (el) => !el || el == {};




module.exports = CartHelper;