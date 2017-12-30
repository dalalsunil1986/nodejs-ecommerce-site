const {
  Product,
  Category,
  User,
  sequelize,
  Sequelize: {Op}  //destructuring: Op = Sequelize.Op  ... makes query operators available
  } = require('../../models/sequelize');
  
const helpers = require('../../helpers');

var sqlData = {};

sqlData.getProductCategories = () => {
  return Category
  .findAll({raw:true})
  .then(allCategories => {
    // let categories = allCategories.map(category => category.dataValues.name);
    // console.log(categories);
    console.log("allCategories");
    console.log(allCategories);
    return allCategories;
  });
};

sqlData.getProductPriceRange = () => {
  return Product.findAll({
    attributes: [
      ['MIN("price")', 'min'],
      ['MAX("price")', 'max']
    ],
    raw: true
  }).then(priceRange => {   //priceRange is an object inside an array
    console.log("priceRange");
    console.log(priceRange);
    return priceRange[0];  
  });
};


// Product.findAll({
//   include: [{
//     model: Category,
//     where: {}
//   }],
//   raw: true
// }).then(result => { 
//   console.log(result.length)
//   console.log(result)
  
// });

// sqlData.getProductCategories();

module.exports = sqlData;
