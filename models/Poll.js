'use strict';
var Sequelize = require('sequelize');
var connection = require(__dirname + '/../config/db');
var Category = require(__dirname + '/../models/Category');

var Poll = connection.define('polls', {
	name: {
		type: Sequelize.STRING,
		field: 'name',
		allowNull: false,
	},
	description: {
		type: Sequelize.STRING,
		field: 'description'
	},
});


connection.sync({
}).then(function(){
	//--- Promise comes here!!
});

module.exports = Poll;