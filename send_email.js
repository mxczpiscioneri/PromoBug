var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var dotenv = require('dotenv');
dotenv.load();

var send = function(textMessage) {
	var transporter = nodemailer.createTransport(smtpTransport({
		service: process.env.EMAIL_SERVICE,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS
		}
	}));

	var mailOptions = {
		from: 'Matheus Piscioneri <teste@matheuspiscioneri.com.br>',
		to: 'mxczpiscioneri@gmail.com, brenorios84@gmail.com',
		subject: 'Promoção',
		html: textMessage
	}

	transporter.sendMail(mailOptions, function(error, response) {
		if (error) console.log(error);
		transporter.close();
	});
}

module.exports = {
	send: send
}