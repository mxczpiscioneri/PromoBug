var dotenv = require('dotenv');
dotenv.load();

module.exports = function(mongoose) {
	mongoose.connect('mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_DB);
	var priceSchema = new mongoose.Schema({
		store: String,
		idProduct: Number,
		name: String,
		category: String,
		price: Number,
		oldPrice: Number,
		lowerPrice: Number,
		percent: Number,
		link: String,
		dateLastUpdate: {
			type: Date,
			default: Date.now
		},
		dateLowerPrice: {
			type: Date,
			default: Date.now
		}
	});
	return Price = mongoose.model('promisse', priceSchema);
};