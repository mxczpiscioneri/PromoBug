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
	Price.find({})
		.sort([
			['percent', 'desc'],
			['name', 'asc']
		])
		.exec(function(err, prices) {
			if (err) res.send(err);

			res.render('index', {
				data: prices,
				column: '',
				order: ''
			});
		});
});

app.get('/list/:column/:order', function(req, res) {
	var column = req.params.column;
	var order = req.params.order;
	var schema = Price.findOne().schema.obj;

	if (schema.hasOwnProperty(column) && (order === 'asc' || order === 'desc')) {
		Price.find({})
			.sort([
				[column, order],
				['name', 'asc']
			])
			.exec(function(err, prices) {
				if (err) res.send(err);

				res.render('index', {
					data: prices,
					column: column,
					order: order
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

app.listen(process.env.PORT || 8080, function() {
	console.log('App listening on port 8080!');
});