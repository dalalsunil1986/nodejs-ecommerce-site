'use strict';
module.exports = (sequelize, DataTypes) => {
  var Product = sequelize.define('Product', {
    name: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    sku: DataTypes.INTEGER,
    description: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    categoryId: DataTypes.INTEGER,
    relatedProducts: DataTypes.ARRAY(DataTypes.INTEGER)
  });
  Product.associate = function(models) {
      // associations can be defined here
    Product.belongsTo(models.Category, {
      foreignKey: "categoryId"
    });
  };
  
  return Product;
};