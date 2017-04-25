var express = require('express');
var router = express.Router();

var Sequelize = require('sequelize');
var bcrypt = require('bcryptjs');

var connection = require(__dirname + '/../config/db');
var roles = require(__dirname + '/../config/roles');
var User = require(__dirname + '/../models/userModel');
var Candidate = require(__dirname + '/../models/Candidate');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/test', function(req, res, done){
    res.send(bcrypt.compareSync("0727546130", "$2a$10$ablYAtmwv7MaYr5LLYzJEe9z.racY8UnOnVF1GKpZBM7vMkFHE0Si"));
});

router.post('/fetch', function(req, res, done){
	userids = req.body.candidates;
	Candidate.findAll({
		where: {'id': {
			in: userids
		}},
	}).then(function(candidate) {
		res.json(candidate);
	})
    
});

router.get('/create',function(req,res){
	var salt = bcrypt.genSaltSync(10);
	var hash = bcrypt.hashSync("0727546130", salt);
    User.create({
			username: "wamuyu",
			names: "Joe Maina",
			password: hash,
			phone: "0727546130"
		}).then(function(){
			console.log("record was successful");
			res.render('users',{
				msg: "Record inserted successfully",
				title: "Users page"
			});
		}).catch(function(err){
			console.log(err.errors[0].message);
			res.render('users',{
				errors: err.errors[0].message,
				title: "Users page"
			});
		});
});
module.exports = router;
