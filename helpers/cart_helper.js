

const CartHelper = {};



CartHelper.cartTotal = (cart) => {
  let total = cart.reduce((sum, item) => {
    return sum += item.price * item.quantity;
  }, 0);
  return total.toFixed(2);
};
CartHelper.itemTotal = (price, quantity) => {
  return (price * quantity).toFixed(2);
}



module.exports = CartHelper;