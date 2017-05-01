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
var News = require(__dirname + '/../models/News');

router.get('/',roles.auth,function(req,res,next){
     News.findAll()
     .then(function(news){
        res.render('news/index', { 
			title: 'News',
			news: news,
		});
     })
     .catch(function(err){
         console.log(err);
     })
});

router.get('/create',roles.admin, function(req, res, next) {
	  	res.render('news/create', { 
			title: 'Create News'
		});
});

router.get('/update/:id',roles.admin, function(req, res, next) {
  	News.findOne({
		where: {
            id: req.params.id
          }
	}).then(function(news){
  		res.render('news/update', { title: 'Update News', news: news});
  	});
});

router.post('/update/:id',roles.admin, function(req, res, next) {
	 var name = req.body.name;
	var description = req.body.description;
	var id = req.body.id;

	req.checkBody('name','Should not be empty').notEmpty();	
	req.checkBody('description','Should not be empty').notEmpty();

	News.findById(id).then(function(news){
		news.update({
			name: name,
			desc:description,
		}).then(function(){			
			res.redirect("/news");
		}).catch(function(err){
			res.render('news/index', { 
				title: 'Error',
				errors: err.errors[0].message,
			});
		});
	});
});

router.post('/create',roles.admin, function(req, res, next) {
	var name = req.body.name;
	var description = req.body.description;

	req.checkBody('name','Should not be empty').notEmpty();
	req.checkBody('description','Should not be empty').notEmpty();

	News.create({
		name: name,
		desc:description,
	}).then(function(){
		res.redirect('/news');
	}).catch(function(err){
		res.render('news/index', { 
			title: 'Error',
			errors: err.errors[0].message,
		});
	});
});

module.exports = router;