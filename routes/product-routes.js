const Express = require('express');
// const app = Express();
const router = Express.Router();

// const models = require('../models/sequelize');
// const sequelize = models.sequelize;
// const {Sequelize: {Op}} = models;   //destructuring: Op = Sequelize.Op  ... makes query operators available

// const Product = models.Product;

const {
  Product,
  Category,
  User,
  sequelize,
  Sequelize: {Op}  //destructuring: Op = Sequelize.Op  ... makes query operators available
  }  = require('../models/sequelize');

const sqlData = require('../services/sequelize/sequelize-data');
const helpers = require('../helpers');



// Get Form Defaults
var formDefaults = {};
sqlData.getProductCategories().then(categories => formDefaults.categories = categories);
sqlData.getProductPriceRange().then(range => {
  formDefaults.priceRange = range;
  formDefaults.priceIncrements = [];
  for (let i = 0; i <= Math.ceil(range.max) + 1; i++) {
    formDefaults.priceIncrements.push(i);
  }
});

console.log("formDefaults");
console.log(formDefaults);
  
var _buildQuery = (searchSettings) => {
  console.log("building query");
  let query = {};
  
  // check searchSettings for user inputs
  // fill in the remaining search settings with defaults
  console.log("searchSettings.minPrice");
  console.log(searchSettings.minPrice);
  
  query.categories = 
    searchSettings.category ? {name: searchSettings.category} : {};
    
  query.priceRange = {
    price: {[Op.between]: [searchSettings.minPrice || formDefaults.priceRange.min, searchSettings.maxPrice ||formDefaults.priceRange.max]}};
    // [Op.between]: [formDefaults.priceRange.min, formDefaults.priceRange.max]}
  
  console.log("completed query");
  console.log(query);
  
  return query;
};


// Middleware: Saving the search request query as a searchSettings session cookie.
// _buildSearchSettings will use defaults for anything not specified. 
router.use('/', (req, res, next) => {  
  console.log("middleware");
  console.log("req.session");
  console.log(req.session);
  req.query.selections = req.query.selections || {};
  req.session.searchSettings = req.session.searchSettings || {}; 
  for (let prop in req.query.selections) {
    if (req.query.selections[prop] === "clear") req.query.selections[prop] = null;
  }
  console.log("req.query.selections");
  console.log(req.query.selections);
  console.log("req.session");
  console.log(req.session);
  req.session.searchSettings = Object.assign(req.session.searchSettings, req.query.selections);
  res.locals.searchSettings = req.session.searchSettings;
  console.log("req.session");
  console.log(req.session);
  next();
});

  
router.get('/', (req, res) => {
  console.log("inside the product-index route");
  console.log("req.query");
  console.log(req.query);
  console.log("req.body");
  console.log(req.body);
  // Produce Query
  var query = _buildQuery(req.session.searchSettings);
  // Run the resulting query
  sqlData.getProducts(query)
  .then(productList => {
    console.log("productList");
    console.log(productList);
    console.log("formDefaults");
    console.log(formDefaults);
    res.render('products/product-index', {
      products: productList,
      categories: formDefaults.categories,
      priceRange: formDefaults.priceRange,
      priceIncrements: formDefaults.priceIncrements
    });
  });
});

router.get('/:id', (req, res) => {
  sqlData.getProductAndRelated(req.params.id)
  .then(results => {
    console.log(results);
    res.render('products/product-page', {
      product: results.primary,
      related: results.related
    });
  });
});

module.exports = router;

