

const ProductsHelper = {};


ProductsHelper.productsPath = () => '/products';
ProductsHelper.productPath = id => `/products/${ id }`;
ProductsHelper.quantityRange = () => {
  const MAX_QUANTITY_IN_VIEW = 10;
  let quantityList = [];
  for (let i = 1; i <= MAX_QUANTITY_IN_VIEW; i++) {
    quantityList.push(i);
  }
  return quantityList;
};




module.exports = ProductsHelper;