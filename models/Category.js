var Sequelize = require('sequelize');
var connection = require(__dirname + '/../config/db');

var Category = connection.define('category', {
	name: {
		type: Sequelize.STRING,
		field: 'name',
		unique: true,
		allowNull: false,
	}
});

connection.sync({
}).then(function(){
	//--- Promise comes here!!
}).catch(function(err){
	console.log(err);
});

module.exports = Category;