var express = require('express');
var app = express();
var mongoose = require('mongoose');
var Price = require('./mongo.js');
var getProducts = require('./get_products.js');

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', function(req, res) {

	Price.find({})
		.sort({
			percent: 'desc'
		})
		.exec(function(err, prices) {
			if (err) res.send(err);

			res.render('index', {
				data: prices
			});
		});

});

app.get('/update', function(req, res) {
	console.log("Get all products");
	getProducts.getAll(Price, true);
	res.send('Updating...');
});

app.listen(process.env.PORT || 8080, function() {
	console.log('App listening on port 8080!');
});