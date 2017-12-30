'use strict';

const models = require('../../models/sequelize');
const faker = require('faker');

const CATEGORIES = 5;

module.exports = {
  up: (queryInterface, Sequelize) => {
    var categories = [];
    for (let i = 1; i <= CATEGORIES; i++) {
      categories.push({
        name: faker.commerce.department()
      });
    }
    console.log(categories);
    return queryInterface.bulkInsert('Categories', categories); 
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Categories', null, {}, models.Category);

  }
};
