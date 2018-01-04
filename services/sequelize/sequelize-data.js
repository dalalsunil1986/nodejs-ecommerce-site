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

sqlData.getProducts = (query) => {
  return Product.findAll({
    where: query.priceRange,
    include: [{
      model: Category,
      where: query.categories
    }],
    raw:true
  });
};

sqlData.getProductById = (id) => {
  return Product.findById(id);
};

sqlData.getProductsByList = (list) => {
  if (list.length === 0) {
    return new Promise((resolve, reject) => {
      return resolve([]);
    });
  } else {
    return Product.findAll({
      where: {id: {[Op.or]: list}}, 
      include: [{model: Category}],
      raw: true
    });
  }
};



sqlData.getProductAndRelated = (productId) => {
  let results = {};
  return Product
  .find({
    where: {id: productId},
    include: {model: Category},
    raw:true
  })
  .then(product => {
    results.primary = product;
    return product.categoryId;
  })
  .then(categoryId => {
    return Category.findAll({
      where: {id: categoryId},
      include: {model: Product,
        where: {id: {[Op.ne]: productId}} 
      },
      raw: true
    });
  })
  .then(relatedProducts => {
    results.related = relatedProducts;
    return results;
  });
  
};

module.exports = sqlData;
