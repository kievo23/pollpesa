var Sequelize = require('sequelize');
var connection = require(__dirname + '/../config/db');
var Category = require(__dirname + '/../models/Category');

var Region = connection.define('region', {
	name: {
		type: Sequelize.STRING,
		field: 'name'
	},
});

Region.belongsTo(Category);

connection.sync({
}).then(function(){
	//--- Promise comes here!!
});

module.exports = Region;