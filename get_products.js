var request = require('request');
var cheerio = require('cheerio');
var Email = require('./send_email.js');

var page, total, arrayItems;
var run_server = false;
var textMessage = '';

var getAll = function(Price, server) {
	if (server) run_server = true;
	clearVariables();
	console.log('Call getSubmarinoSmartphones');
	getSubmarinoSmartphones(Price);
}

var getSubmarinoSmartphones = function(Price) {
	request(`http://www.submarino.com.br/ajax/ofertas/linha/350374/celulares-e-telefonia-fixa/smartphone?ofertas.limit=90&ofertas.offset=${page}`, function(err, res, body) {
		console.log(`http://www.submarino.com.br/ajax/ofertas/linha/350374/celulares-e-telefonia-fixa/smartphone?ofertas.limit=90&ofertas.offset=${page}`);
		if (err || res.statusCode != 200) console.log(err);

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
						'percent': 0,
						'link': link
					});
					// console.log(`${name} (${price})`);
					total++;
				}
			});

			page = page + 90;
			getSubmarinoSmartphones(Price);
		} else {
			console.log(`Total: ${total}`);
			saveAll(Price, getSubmarinoCervejas, 0);
		}

	});
}

var getSubmarinoCervejas = function(Price) {
	request(`http://www.submarino.com.br/ajax/ofertas/sublinha/300088/alimentos-e-bebidas/bebidas-alcoolicas/cervejas-especiais?ofertas.limit=90&ofertas.offset=${page}`, function(err, res, body) {
		console.log(`http://www.submarino.com.br/ajax/ofertas/sublinha/300088/alimentos-e-bebidas/bebidas-alcoolicas/cervejas-especiais?ofertas.limit=90&ofertas.offset=${page}`);
		if (err || res.statusCode != 200) console.log(err);

		var $ = cheerio.load(body);
		if (body.length > 0 && $('.products-area').find('.single-product').length > 0) {

			$('.products-area .single-product').each(function() {
				var store = 'Submarino';
				var idProduct = $(this).find('.productId').val();
				var name = $(this).find('.productInfo .top-area-product a span').text().trim();
				var category = 'Cerveja';
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
						'percent': 0,
						'link': link
					});
					// console.log(`${name} (${price})`);
					total++;
				}
			});

			page = page + 90;
			getSubmarinoCervejas(Price);
		} else {
			console.log(`Total: ${total}`);
			saveAll(Price, getEmporioCervejas, 0);
		}

	});
}

var getEmporioCervejas = function(Price) {
	request(`http://www.emporiodacerveja.com.br/buscapagina?fq=C%3a%2f9%2f&PS=45&sl=d3798342-50b3-490e-aac9-c1aa0d5f63d8&cc=3&sm=0&PageNumber=${page}`, function(err, res, body) {
		console.log(`http://www.emporiodacerveja.com.br/buscapagina?fq=C%3a%2f9%2f&PS=45&sl=d3798342-50b3-490e-aac9-c1aa0d5f63d8&cc=3&sm=0&PageNumber=${page}`);
		if (err || res.statusCode != 200) console.log(err);

		var $ = cheerio.load(body);
		if (body.length > 0) {

			$('.prateleira  ul .cervejas').each(function() {
				var store = 'Emporio';
				var idProduct = $(this).find('.x-id').val();
				var name = $(this).find('h3 a').text().trim();
				var category = 'Cerveja';
				var price = $(this).find('.x-bestPrice strong').text().trim().replace('.', '').replace(',', '.').replace('R$ ', '');
				var link = $(this).find('.x-productImage').attr('href');

				if (price) {
					arrayItems.push({
						'store': store,
						'idProduct': idProduct,
						'name': name,
						'category': category,
						'price': price,
						'oldPrice': price,
						'lowerPrice': price,
						'percent': 0,
						'link': link
					});
					// console.log(`${name} (${price})`);
					total++;
				}
			});

			page = page + 1;
			getEmporioCervejas(Price);
		} else {
			console.log(`Total: ${total}`);
			saveAll(Price, getGearbestSmartphones, 1);
		}

	});
}

var getGearbestSmartphones = function(Price) {
	request(`http://www.gearbest.com/cell-phones-c_11293/${page}.html?page_size=120`, function(err, res, body) {
		console.log(`http://www.gearbest.com/cell-phones-c_11293/${page}.html?page_size=120`);
		if (err || res.statusCode != 200) console.log(err);

		var $ = cheerio.load(body);
		if (body.length > 0) {

			$('#catePageList li').each(function() {
				try {
					var store = 'Gearbest';
					var idProduct = $(this).find('.js_addToCompare').attr('data-goodsid');
					var name = $(this).find('.all_proNam a').text().trim();
					var category = 'Smartphone';
					var price = $(this).find('.my_shop_price').attr('orgp').trim();
					var link = $(this).find('.all_proNam a').attr('href');
				} catch (err) {}

				if (price) {
					arrayItems.push({
						'store': store,
						'idProduct': idProduct,
						'name': name,
						'category': category,
						'price': price,
						'oldPrice': price,
						'lowerPrice': price,
						'percent': 0,
						'link': link
					});
					// console.log(`${name} (${price})`);
					total++;
				}
			});

			if ($('.cate_list_footer').find('.next').length > 0) {
				page = page + 1;
				getGearbestSmartphones(Price);
			} else {
				console.log(`Total: ${total}`);
				saveAll(Price, getGearbestComputadores, 1);
			}
		} else {
			console.log(`Total: ${total}`);
			saveAll(Price, getGearbestComputadores, 1);
		}

	});
}

var getGearbestComputadores = function(Price) {
	request(`http://www.gearbest.com/computers-networking-c_11257/${page}.html?page_size=120`, function(err, res, body) {
		console.log(`http://www.gearbest.com/computers-networking-c_11257/${page}.html?page_size=120`);
		if (err || res.statusCode != 200) console.log(err);

		var $ = cheerio.load(body);
		if (body.length > 0) {

			$('#catePageList li').each(function() {
				try {
					var store = 'Gearbest';
					var idProduct = $(this).find('.js_addToCompare').attr('data-goodsid');
					var name = $(this).find('.all_proNam a').text().trim();
					var category = 'Computador';
					var price = $(this).find('.my_shop_price').attr('orgp').trim();
					var link = $(this).find('.all_proNam a').attr('href');
				} catch (err) {}

				if (price) {
					arrayItems.push({
						'store': store,
						'idProduct': idProduct,
						'name': name,
						'category': category,
						'price': price,
						'oldPrice': price,
						'lowerPrice': price,
						'percent': 0,
						'link': link
					});
					// console.log(`${name} (${price})`);
					total++;
				}
			});

			if ($('.cate_list_footer').find('.next').length > 0) {
				page = page + 1;
				getGearbestComputadores(Price);
			} else {
				console.log(`Total: ${total}`);
				saveAll(Price, getCervejastoreCervejas, 1);
			}
		} else {
			console.log(`Total: ${total}`);
			saveAll(Price, getCervejastoreCervejas, 1);
		}

	});
}

var getCervejastoreCervejas = function(Price) {
	request({
		url: `http://www.cervejastore.com.br/pesquisa/?pagina=${page}&s=279&p=%25%25%25`,
		headers: {
			'User-Agent': 'Mozilla/5.0'
		}
	}, function(err, res, body) {
		console.log(`http://www.cervejastore.com.br/pesquisa/?pagina=${page}&s=279&p=%25%25%25`);
		if (err || res.statusCode != 200) console.log(err);

		var $ = cheerio.load(body);
		if (body.length > 0 && $('.products').find('li').length > 0) {

			$('.products li').each(function() {
				try {
					var store = 'Cerveja Store';
					var idProduct = $(this).find('.buy').attr('href').split("produtoid=")[1];
					var name = $(this).find('.product-name a').text().trim();
					var category = 'Cerveja';
					var price = $(this).find('.price .sale').text().trim().replace(',', '.').replace('R$ ', '');
					var link = $(this).find('.product-name a').attr('href');
				} catch (err) {}

				if (price) {
					arrayItems.push({
						'store': store,
						'idProduct': idProduct,
						'name': name,
						'category': category,
						'price': price,
						'oldPrice': price,
						'lowerPrice': price,
						'percent': 0,
						'link': link
					});
					// console.log(`${name} (${price})`);
					total++;
				}
			});

			page = page + 1;
			getCervejastoreCervejas(Price);
		} else {
			console.log(`Total: ${total}`);
			saveAll(Price, getBanggoodSmartphones, 1);
		}

	});
}

var getBanggoodSmartphones = function(Price) {
	request(`http://www.banggood.com/Wholesale-Smartphones-c-1567-0-1-1-45-0_page${page}.html`, function(err, res, body) {
		console.log(`http://www.banggood.com/Wholesale-Smartphones-c-1567-0-1-1-45-0_page${page}.html`);
		if (err || res.statusCode != 200) console.log(err);

		var $ = cheerio.load(body);
		if (body.length > 0 && $('.good_box_min').find('.goodlist_1 ').length > 0) {

			$('.goodlist_1 li').each(function() {
				try {
					var store = 'Banggood';
					var idProduct = $(this).find('.title a').attr('href').split(".html")[0].split("-p-")[1];
					var name = $(this).find('.title a').text().trim();
					var category = 'Smartphone';
					var price = $(this).find('.price').attr('oriprice').trim();
					var link = $(this).find('.title a').attr('href');
				} catch (err) {}

				if (price) {
					arrayItems.push({
						'store': store,
						'idProduct': idProduct,
						'name': name,
						'category': category,
						'price': price,
						'oldPrice': price,
						'lowerPrice': price,
						'percent': 0,
						'link': link
					});
					// console.log(`${name} (${price})`);
					total++;
				}
			});

			page = page + 1;
			getBanggoodSmartphones(Price);
		} else {
			console.log(`Total: ${total}`);
			saveAll(Price, getAmericanasCervejas, 0);
		}

	});
}

var getAmericanasCervejas = function(Price) {
	request(`http://www.americanas.com.br/categoria/315789?limite=90&offset=${page}`, function(err, res, body) {
		console.log(`http://www.americanas.com.br/categoria/315789?limite=90&offset=${page}`);
		if (err || res.statusCode != 200) console.log(err);

		var $ = cheerio.load(body);
		if (body.length > 0 && $('.product-grid').find('.product-grid-item').length > 0) {

			$('.product-grid .product-grid-item').each(function() {
				try {
					var store = 'Americanas';
					var idProduct = $(this).find('.card-product-url').attr('href').split("produto/")[1].split("?")[0];
					var name = $(this).find('.card-product-name').text().trim();
					var category = 'Cerveja';
					var price = $(this).find('.card-product-price .value').text().trim().replace(',', '.').replace('R$', '');
					var link = $(this).find('.card-product-url').attr('href');
				} catch (err) {}

				if (price) {
					arrayItems.push({
						'store': store,
						'idProduct': idProduct,
						'name': name,
						'category': category,
						'price': price,
						'oldPrice': price,
						'lowerPrice': price,
						'percent': 0,
						'link': link
					});
					// console.log(`${name} (${price})`);
					total++;
				}
			});

			page = page + 90;
			getAmericanasCervejas(Price);
		} else {
			console.log(`Total: ${total}`);
			saveAll(Price, false, 0);
		}

	});
}

var saveAll = function(Price, nextFunction, pageInitial) {
	console.log('Save');
	for (var item in arrayItems) {
		if (arrayItems.hasOwnProperty(item)) {
			var lastProduct = false;
			if ((arrayItems.length - 1) == item) lastProduct = true;

			var product = new Price(arrayItems[item]);
			findOne(Price, product, lastProduct, nextFunction, pageInitial);
		}
	}
}

var findOne = function(Price, product, lastProduct, nextFunction, pageInitial) {
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

				if (priceNew != priceCurrent) {
					productFind.oldPrice = priceCurrent;
					productFind.price = priceNew;
					productFind.dateLastUpdate = Date.now();
					productFind.percent = (100 - ((priceNew * 100) / priceCurrent)).toFixed(2);
				}

				if (priceNew < priceLower) {
					productFind.lowerPrice = priceNew;
					productFind.dateLowerPrice = Date.now();
					if (productFind.percent > 10) textMessage += `Minimo (De: ${priceLower} Para: ${priceNew}) ${productFind.name} (${productFind.link}) <br><br>`;
				} else if (priceNew < priceCurrent) {
					if (productFind.percent > 10) textMessage += `Menor (De: ${priceCurrent} Para: ${priceNew}) ${productFind.name} (${productFind.link}) <br><br>`;
				} else if (priceNew > priceCurrent) {
					productFind.percent = 0;
				}

				return productFind.save();
			}
			return product.save();
		})
		.then(function() {
			if (lastProduct) {
				if (nextFunction) {
					clearVariables(pageInitial);
					console.log(`Call ${nextFunction.name}`);
					nextFunction(Price);
				} else {
					console.log(textMessage);
					if (textMessage != '') {
						Email.send(textMessage);
						console.log('Email sent');
					}
					console.log('End');
					if (!run_server) process.exit();
				}
			}
		});
}

var clearVariables = function(pageInitial = 0) {
	page = pageInitial;
	total = 0;
	arrayItems = new Array();
}

module.exports = {
	getAll: getAll
}