const models = require('../models/sequelize');
const sequelize = models.sequelize;
const {Sequelize: {Op}} = models;   //destructuring: Op = Sequelize.Op  ... makes query operators available

const Product = models.Product;

const SearchDefaultsHelper = {};

SearchDefaultsHelper.searchDefaults = () => {
  let searchDefaults = {};
  
  // Getting a list of current product categories
  // Setting them as the defaults for .category
  Product.findAll({
    attributes: ['categoryId']
  }).then(productCategories => {
    searchDefaults.category = productCategories;   
  });
  return searchDefaults;
};


module.exports = SearchDefaultsHelper;
