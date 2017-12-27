'use strict';

const models = require('../../models/sequelize');
const faker = require('faker');


const NUM_OF_USERS = 10;


module.exports = {
  up: (queryInterface, Sequelize) => {
    var users = [];
    for (let i = 0; i < NUM_OF_USERS; i++) {
      users.push({
        fname: faker.name.firstName(),
        lname: faker.name.lastName(),
        username: `user${i}`,
        email: `user${i}@email.com`
      });
    }
    return queryInterface.bulkInsert('Users', users);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {}, models.User);
  }
};
