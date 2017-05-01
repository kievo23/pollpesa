var Sequelize = require('sequelize');
var connection = require(__dirname + '/../config/db');
var Category = require(__dirname + '/../models/Category');
var Region = require(__dirname + '/../models/Region');
var User = require(__dirname + '/../models/userModel');

var Polldetails = connection.define('polldetails', {
	pollid: {
		type: Sequelize.INTEGER,
		field: 'pollid'
	},
	userid: {
		type: Sequelize.STRING,
		field: 'userid'
	},
	opinion: {
		type: Sequelize.INTEGER,
		field: 'opinion'
	}
});


connection.sync({
}).then(function(){
	//--- Promise comes here!!
});

module.exports = Poll;