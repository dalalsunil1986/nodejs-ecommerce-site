

const ProductsHelper = {};


ProductsHelper.productsPath = () => '/products';
ProductsHelper.userPath = id => `/products/${ id }`;
// ProductsHelper.newUserPath = () => '/products/new';
// ProductsHelper.editUserPath = () => `/products/edit`;
ProductsHelper.destroyUserPath = id => `/products/${ id }/?_method=delete`;
ProductsHelper.feetInches = inches => {
  const foot = 12;
  const feet = Math.floor(inches / foot);
  const remainder = inches % foot;
  let feetInches = `${ feet }'`;
  feetInches += remainder ? ` ${ inches % foot }"` : '';
  return feetInches;
};



module.exports = ProductsHelper;