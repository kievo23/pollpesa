'use strict';
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/pollpesa');

mongoose.connection.once('open', function(){
	console.log("connection to mongodb working");
}).on('error', function(err){
	console.log("Error in mongoose connection");
})