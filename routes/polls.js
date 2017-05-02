var express = require('express');
var router = express.Router();

var Category = require(__dirname + '/../models/Category');
var Region = require(__dirname + '/../models/Region');
var Candidate = require(__dirname + '/../models/Candidate');
var Bet = require(__dirname + '/../models/Bet');
var Betdetails = require(__dirname + '/../models/Details');
var User = require(__dirname + '/../models/userModel');
var connection = require(__dirname + '/../config/db');
var roles = require(__dirname + '/../config/roles');
var Polls = require(__dirname + '/../models/Polls');
var PollOption = require(__dirname + '/../models/PollOptions');

router.get('/',roles.auth,function(req,res,next){
    Polls.findAll()
     .then(function(polls){
        res.render('polls/index', { 
			title: 'Polls',
			polls: polls,
		});
     })
     .catch(function(err){
         console.log(err);
     })
});

router.get('/create',roles.admin, function(req, res, next) {
	  	res.render('polls/create', { 
			title: 'Create Poll'
		});
});

router.get('/update/:id',roles.admin, function(req, res, next) {
  	Polls.findOne({
		where: {
            id: req.params.id
          }
	}).then(function(poll){
  		res.render('polls/update', { title: 'Update News', poll: poll});
  	});
});

router.post('/update/:id',roles.admin, function(req, res, next) {
	 var name = req.body.name;
	var description = req.body.description;
	var id = req.body.id;

	req.checkBody('name','Should not be empty').notEmpty();	
	req.checkBody('description','Should not be empty').notEmpty();

	Polls.findById(id).then(function(poll){
		poll.update({
			name: name,
			desc:description,
		}).then(function(){			
			res.redirect("/poll");
		}).catch(function(err){
			res.render('polls/index', { 
				title: 'Error',
				errors: err.errors[0].message,
			});
		});
	});
});

router.post('/create',roles.admin, function(req, res, next) {
	var name = req.body.name;
	var description = req.body.description;
	var optionone = req.body.optionone;
	var optiontwo = req.body.optiontwo;

	req.checkBody('name','Should not be empty').notEmpty();
	req.checkBody('description','Should not be empty').notEmpty();

	Polls.create({
		name: name,
		desc:description,
	}).then(function(poll){
		var poll1 = PollOption.create({
			pollid: poll.id,
			name: optionone
		});
		var poll2 = PollOption.create({
			pollid: poll.id,
			name: optiontwo
		});
		Promise.all([poll1,poll2]).then(values => {
			res.redirect('/poll');
		});
	}).catch(function(err){
		res.render('polls/index', { 
			title: 'Error',
			errors: err.errors[0].message,
		});
	});
});

module.exports = router;