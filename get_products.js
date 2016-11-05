var request = require('request');
var cheerio = require('cheerio');
var Email = require('./send_email.js');

var page = 0;
var total = 0;
var arrayItems = new Array();

var getAll = function(Price) {
	console.log('Get products Submarino');
	getSubmarino(Price);
}

var getSubmarino = function(Price) {
	request(`http://www.submarino.com.br/ajax/ofertas/linha/350374/celulares-e-telefonia-fixa/smartphone?ofertas.limit=90&ofertas.offset=${page}`, function(err, res, body) {
		if (err || res.statusCode != 200) console.log('Erro: ' + err);

		var $ = cheerio.load(body);
		if (body.length > 0 && $('.products-area').find('.single-product').length > 0) {

			$('.products-area .single-product').each(function() {
				var store = 'Submarino';
				var idProduct = $(this).find('.productId').val();
				var name = $(this).find('.productInfo .top-area-product a span').text().trim();
				var category = 'Smartphone';
				var price = $(this).find('.productInfo .product-info .price-area .sale.price strong').text().trim().replace('.', '').replace(',', '.').replace('R$ ', '');
				var link = $(this).find('.url').attr('href');

				if (price) {
					arrayItems.push({
						'store': store,
						'idProduct': idProduct,
						'name': name,
						'category': category,
						'price': price,
						'oldPrice': price,
						'lowerPrice': price,
						'percent': null,
						'link': link
					});
					console.log(`${name} (${price})`);
					total++;
				}
			});

			page = page + 900;
			getSubmarino(Price);
		} else {
			console.log(`Total: ${total}`);
			saveAll(Price);
		}

	});
}

var saveAll = function(Price) {
	for (var item in arrayItems) {
		if (arrayItems.hasOwnProperty(item)) {
			var lastProduct = false;
			if ((arrayItems.length - 1) == item) lastProduct = true;

			var product = new Price(arrayItems[item]);
			findOne(Price, product, lastProduct);
		}
	}
}

var findOne = function(Price, product, lastProduct) {
	var query = {
		store: product.store,
		idProduct: product.idProduct
	};

	var promise = Price.findOne(query).exec();

	promise.then(function(productFind) {

			if (productFind) {
				var priceNew = product.price;
				var priceCurrent = productFind.price;
				var priceOld = productFind.oldPrice;
				var priceLower = productFind.lowerPrice;

				productFind.oldPrice = priceCurrent;
				productFind.price = priceNew;
				productFind.dateLastUpdate = Date.now();

				if (priceNew < priceLower) {
					productFind.lowerPrice = priceNew;
					productFind.dateLowerPrice = Date.now();
					productFind.percent = (100 - ((priceNew * 100) / priceCurrent)).toFixed(2);
					var msg = `Minimo (De: ${priceLower} Para: ${priceNew})<br><br>${productFind}`;
					if (priceCurrent & productFind.percent > 10) Email.send(textMessage);
				} else if (priceNew < priceCurrent) {
					productFind.percent = (100 - ((priceNew * 100) / priceCurrent)).toFixed(2);
					var msg = `Menor (De:'p${riceCurrent} Para: ${priceNew})<br><br>${productFind}`;
					if (priceCurrent & productFind.percent > 10) Email.send(textMessage);
				}

				return productFind.save();
			}
			return product.save();
		})
		.then(function() {
			if (lastProduct) {
				console.log('Fim');
				// process.exit();
			}
		});
}

module.exports = {
	getAll: getAll
}