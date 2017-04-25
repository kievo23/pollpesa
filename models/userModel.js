var Sequelize = require('sequelize');
var connection = require(__dirname + '/../config/db');

var User = connection.define('user', {
	username: {
		type: Sequelize.STRING,
		field: 'username',
		unique: true,
		allowNull: false,
	},
	names: {
		type: Sequelize.STRING,
		field: 'full_names'
	},
	phone: {
		type: Sequelize.STRING,
		field: 'phone',
		unique: true
	},
	password: {
		type: Sequelize.STRING
	},
	role: {
		type: Sequelize.INTEGER,
		field: 'role',
		allowNull: true,
	},
	credits: {
		type: Sequelize.INTEGER,
		field: 'credits',
		allowNull: true,
	},
});

connection.sync({
}).then(function(){
	//--- Promise comes here!!
});

module.exports = User;