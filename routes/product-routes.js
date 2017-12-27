const Express = require('express');
const router = Express.Router();

const models = require('../models/sequelize');
const sequelize = models.sequelize;
const {Sequelize: {Op}} = models;   //destructuring: Op = Sequelize.Op  ... makes query operators available

const Product = models.Product;

const helpers = require('../helpers');

var _setProductSearchSettings = (searchOptions) => {
  let searchSettings = {};
  
  return searchSettings;
};

router.get('/', (req, res) => {
  console.log("inside the product-index route");
  let searchSettings = _getProductSearchSettings();
  Product
  .findAll()
  .then(allProducts => {
    let products = allProducts.map(product => product.dataValues);
    console.log(products);
    res.render('products/product-index', {
      products: products,
      searchSettings: searchSettings
    });  
  });
});

router.post('/', (req, res) => {
  _setProductSearchSettings(req.body.searchOptions);
  req.method = 'GET';
  res.redirect('/');
});

module.exports = router;

