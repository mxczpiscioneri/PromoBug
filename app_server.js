var express = require('express');
var app = express();
var mongoose = require('mongoose');
var Price = require('./mongo.js');
var getProducts = require('./get_products.js');

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public'));
app.use('/css', express.static(__dirname + '/node_modules/acsset/css'));

app.get('/', function(req, res) {
	var search = req.query.search;
	var column = req.query.column;
	var order = req.query.order;
	var schema = Price.findOne().schema.obj;

	if (column == undefined) column = 'dateLowerPrice';
	if (order == undefined) order = 'desc';
	if (search == undefined) search = '';

	if (schema.hasOwnProperty(column) && (order === 'asc' || order === 'desc')) {
		Price.find({
				name: new RegExp(search, 'i')
			})
			.sort([
				[column, order],
				['percent', 'desc'],
				['name', 'asc']
			])
			.exec(function(err, prices) {
				if (err) res.send(err);

				Price.count({
					'name': new RegExp(search, 'i')
				}, function(err, count) {
					res.render('index', {
						data: prices,
						column: column,
						order: order,
						total: count,
						search: search
					});
				});
			});
	} else {
		res.redirect('/');
	}
});

app.get('/update', function(req, res) {
	console.log("Get all products");
	getProducts.getAll(Price, true);
	res.send('Updating...');
});

app.get('/remove', function(req, res) {
	Price.find({})
		.sort([
			['idProduct', 'asc']
		])
		.exec(function(err, prices) {
			if (err) res.send(err);

			var previousProduct;
			for (var i = 0; i < prices.length; i++) {
				var product = prices[i].store + prices[i].idProduct;
				if (product == previousProduct) {
					console.log(`Removed: ${product}`);
					prices[i].remove();
				}
				previousProduct = product;
			}
		});

	res.send('Removed...');
});

app.listen(process.env.PORT || 8080, function() {
	console.log('App listening on port 8080!');
});