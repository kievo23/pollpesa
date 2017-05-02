'use strict';
const Sequelize = require('sequelize');
const connection = new Sequelize('pollpesa','postgres','kev@50',{
	host: 'localhost',
	dialect: 'postgres',
	pool: {
	    max: 15,
	    min: 0,
	    idle: 10000
	  },
});


module.exports = connection;