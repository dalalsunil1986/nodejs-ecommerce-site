var faker = require('faker');
const mongoose = require('mongoose');
const models = require('../../models/mongoose');
var env = process.env.NODE_ENV || 'development';
var config = require('../../config/mongoose')[env];
const mongooseeder = require('mongooseeder');

const {
  StripeTransaction
} = models;


var seeds = () => {
  var stripeTransactionSeeds = [];
  
  console.log("creating transaction record...");
  stripeTransactionSeeds.push(new StripeTransaction({
    stripeDetails: {
      stripeToken: "tok_1Bh3pgAV2MgeOOLRm2adJgwj",
      stripeTokenType: "card",
      stripeEmail: "patrick.klima@gmail.com"
    },
    userInfo: {
      firstName: "Patrick",
      lastName: "Klima",
      email: "patrick.klima@gmail.com",
      street: "123 F St",
      city: "San Diego",
      state: "CA"
    },
    cartContents: [ { 
      id: 1,
      name: 'Unbranded Frozen Chicken',
      imageUrl: 'http://lorempixel.com/640/480/technics',
      sku: 58285,
      description: 'Sleek Steel Unbranded Frozen Chicken',
      price: 5.27,
      categoryId: 2,
      quantity: 1 },
    { id: 2,
      name: 'Refined Rubber Pizza',
      imageUrl: 'http://lorempixel.com/640/480/technics',
      sku: 43354,
      description: 'Unbranded Concrete Refined Rubber Pizza',
      price: 8.47,
      categoryId: 3,
      quantity: 1 } 
      ]
    })
  );
  console.log("done.");
  
  console.log("saving new records...");
  const allSeeds = [
    // add more seed arrays here
    ...stripeTransactionSeeds
  ];
  
  const savedSeedPromises = allSeeds.map(seed => seed.save());
  console.log("done.");
  
  console.log("returning....");
  return Promise.all(savedSeedPromises);
    
};



// Always use the MongoDB URL to allow
// easy connection in all environments
const mongodbUrl = process.env.NODE_ENV === 'production' ?
  process.env[config.use_env_variable] :
  `mongodb://${ config.host }/${ config.database }`;

mongooseeder.seed({
  mongodbUrl: mongodbUrl,
  seeds: seeds,
  clean: true,
  models: models,
  mongoose: mongoose
});