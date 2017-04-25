var Sequelize = require('sequelize');
var connection = require(__dirname + '/../config/db');
var Category = require(__dirname + '/../models/Category');
var Region = require(__dirname + '/../models/Region');
var User = require(__dirname + '/../models/userModel');
var Bet = require(__dirname + '/../models/Bet');
var Candidate = require(__dirname + '/../models/Candidate');

var Betdetails = connection.define('betdetails', {
	odd: {
		type: Sequelize.STRING,
		field: 'odd'
	},	
	status: {
		type: Sequelize.STRING,
		field: 'status'
	},
});

Betdetails.belongsTo(Bet, {
    as: 'bet',
    foreignKey: 'betid'
});


connection.sync({
}).then(function(){
	//--- Promise comes here!!
});

module.exports = Betdetails;