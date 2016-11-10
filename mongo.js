var mongoose = require('mongoose');
var dotenv = require('dotenv');
dotenv.load();

var db = mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DB}`);

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

priceSchema.index({ store: 1, idProduct: 1 }, { unique: true });

var Price = db.model('promotion', priceSchema);

module.exports = Price;