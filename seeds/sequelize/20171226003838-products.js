'use strict';

const models = require('../../models/sequelize');
const faker = require('faker');

const helpers = require('../../helpsers');

const CATEGORIES = helpers.SeedConstantsHelper.numOfCategories();
const PRODUCTS_PER_CATEGORY = 3;


module.exports = {
  up: (queryInterface, Sequelize) => {
    var products = [];
    for (let i = 0; i < CATEGORIES*PRODUCTS_PER_CATEGORY; i++) {
      let fakeProductName = faker.commerce.productName();
      products.push({
        name: fakeProductName,
        imageUrl: faker.image.technics(),
        sku: faker.random.number(),
        description: 
          faker.commerce.productAdjective()+" "+
          faker.commerce.productMaterial()+" "+
          fakeProductName,
        price: faker.commerce.price(),
        categoryId: i%CATEGORIES
      });
    }
    // products = products.map(mapProduct => {
    //   mapProduct.relatedProducts = [];
    //   mapProduct.relatedProducts = 
    //     products.filter(filterProduct => mapProduct.categoryId === filterProduct);
    // });
    return queryInterface.bulkInsert('Products', products); 
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Products', null, {}, models.Product);
  }
};
