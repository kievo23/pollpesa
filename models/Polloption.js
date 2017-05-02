'use strict';

var Sequelize = require('sequelize');
var connection = require(__dirname + '/../config/db');
var Category = require(__dirname + '/../models/Category');
var Region = require(__dirname + '/../models/Region');
var User = require(__dirname + '/../models/userModel');
var Poll = require(__dirname + '/../models/Poll');

var Polloption = connection.define('polloptions',
 	{
		pollid: {
			type: Sequelize.INTEGER,
			field: 'pollid'
		},
		name: {
			type: Sequelize.STRING,
			field: 'name'
		}
	}
);

Polloption.belongsTo(Poll, {
    as: 'poll',
    foreignKey: 'pollid'
});

connection.sync({
}).then(function(){
	//--- Promise comes here!!
});

module.exports = Polloption;