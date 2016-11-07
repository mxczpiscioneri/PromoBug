var mongoose = require('mongoose');
var Price = require('./mongo.js');
var getProducts = require('./get_products.js');

console.log('Get all products');
getProducts.getAll(Price, false);