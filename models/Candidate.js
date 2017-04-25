var Sequelize = require('sequelize');
var connection = require(__dirname + '/../config/db');
var Category = require(__dirname + '/../models/Category');
var Region = require(__dirname + '/../models/Region');
var Betdetails = require(__dirname + '/../models/Details');

var Candidate = connection.define('candidate', {
	name: {
		type: Sequelize.STRING,
		field: 'name'
	},
	position: {
		type: Sequelize.STRING,
		field: 'position'
	},
	odd: {
		type: Sequelize.STRING,
		field: 'odd'
	},
	winstatus: {
		type: Sequelize.STRING,
		field: 'winstatus'
	},
	probability: {
		type: Sequelize.INTEGER,
		field: 'probability'
	}
});

Candidate.belongsTo(Region);
Candidate.hasMany(Betdetails, {foreignKey: 'candidateid',as: 'candidate'});

connection.sync({
}).then(function(){
	//--- Promise comes here!!
});

module.exports = Candidate;