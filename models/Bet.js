var Sequelize = require('sequelize');
var connection = require(__dirname + '/../config/db');
var Category = require(__dirname + '/../models/Category');
var Region = require(__dirname + '/../models/Region');
var User = require(__dirname + '/../models/userModel');

var Bet = connection.define('bet', {
	amount: {
		type: Sequelize.STRING,
		field: 'amount'
	},
	initial: {
		type: Sequelize.STRING,
		field: 'initial'
	},
	winstatus: {
		type: Sequelize.STRING,
		field: 'winstatus'
	},	
	status: {
		type: Sequelize.STRING,
		field: 'status'
	},
});

Bet.belongsTo(User);

connection.sync({
}).then(function(){
	//--- Promise comes here!!
});

module.exports = Bet;