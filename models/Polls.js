var Sequelize = require('sequelize');
var connection = require(__dirname + '/../config/db');
var Category = require(__dirname + '/../models/Category');
var Region = require(__dirname + '/../models/Region');
var User = require(__dirname + '/../models/userModel');

var Poll = connection.define('polls', {
	name: {
		type: Sequelize.STRING,
		field: 'name'
	},
	desc: {
		type: Sequelize.STRING,
		field: 'description'
	}
});


connection.sync({
}).then(function(){
	//--- Promise comes here!!
});

module.exports = Poll;