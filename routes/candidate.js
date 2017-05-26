var express = require('express');
var router = express.Router();

var Category = require(__dirname + '/../models/Category');
var Region = require(__dirname + '/../models/Region');
var Candidate = require(__dirname + '/../models/Candidate');
var roles = require(__dirname + '/../config/roles');
var Bet = require(__dirname + '/../models/Bet');
var connection = require(__dirname + '/../config/db');
var async = require('async'),
    QueryBuilder = require('datatable');

/* GET home page. */
router.get('/county',function(req, res, next){
	

	var queries = {};
	queries.recordsTotal = "SELECT COUNT(id) FROM candidates WHERE position ='Senator' OR position ='Women Rep' OR position ='Governor'";
	
	var candidates = Candidate.findAll({ 
	    where: {
			position: {
				$in: ['Senator','Women Rep','Governor']
			}
		},
		include: [
	        { model: Region, as: 'region'}
	    ]
	});

	var totalRecords = connection.query(queries.recordsTotal,
	      { type: connection.QueryTypes.SELECT }
    );

	Promise.all([candidates,totalRecords]).then(values => {
		var result = {};
		result.data = values[0];
		result.recordsTotal = values[1][0].count;
		res.json(result);
	});	
});

router.get('/county/:id',function(req, res, next){
	

	var queries = {};
	queries.recordsTotal = "SELECT COUNT(id) FROM candidates WHERE position ='Senator' OR position ='Women Rep' OR position ='Governor'";
	
	var candidates = Candidate.findAll({ 
	    where: {
			position: {
				$in: ['Senator','Women Rep','Governor']
			}
		},
		include: [
	        { model: Region, as: 'region',where: {'id': req.params.id}}
	    ]
	});

	var totalRecords = connection.query(queries.recordsTotal,
	      { type: connection.QueryTypes.SELECT }
    );

	Promise.all([candidates,totalRecords]).then(values => {
		var result = {};
		result.data = values[0];
		result.recordsTotal = values[1][0].count;
		res.json(result);
	});	
});

router.get('/constituency',function(req, res, next){
	

	var queries = {};
	queries.recordsTotal = "SELECT COUNT(id) FROM candidates WHERE position ='MP'";
	
	var candidates = Candidate.findAll({ 
	    where: {
			position: 'MP'
		},
		include: [
	        { model: Region, as: 'region'}
	    ]
	});

	var totalRecords = connection.query(queries.recordsTotal,
	      { type: connection.QueryTypes.SELECT }
    );

	Promise.all([candidates,totalRecords]).then(values => {
		var result = {};
		result.data = values[0];
		result.recordsTotal = values[1][0].count;
		res.json(result);
	});	
});

router.get('/constituency/:id',function(req, res, next){
	

	var queries = {};
	queries.recordsTotal = "SELECT COUNT(id) FROM candidates WHERE position ='MP'";
	
	var candidates = Candidate.findAll({ 
	    where: {
			position: 'MP'
		},
		include: [
	        { model: Region, as: 'region',where: {'id': req.params.id}}
	    ]
	});

	var totalRecords = connection.query(queries.recordsTotal,
	      { type: connection.QueryTypes.SELECT }
    );

	Promise.all([candidates,totalRecords]).then(values => {
		var result = {};
		result.data = values[0];
		result.recordsTotal = values[1][0].count;
		res.json(result);
	});	
});

router.get('/', function(req, res, next) {

	var candidates = Candidate.findAll({ 
	    where: {
			position: {
				$in: ['Senator','Women Rep','Governor']
			}
		},
		include: [
	        { model: Region, as: 'region'}
	    ]
	});

	var presidents = Candidate.findAll({ 
		where: {
			position: 'president'
		},
	    include: [
	        { model: Region, as: 'region'}
	    ]
	});

	var counties = Region.findAll({
		where: {
			categoryId : 1
		}
	});

	var constituencies = Region.findAll({
		where: {
			categoryId : 2
		}
	});

	var mps = Candidate.findAll({ 
	    where: {
			position: 'MP'
		},
		include: [
	        { model: Region, as: 'region'}
	    ]
	});

	Promise.all([candidates, presidents,counties,constituencies,mps]).then(values => {
		res.render('candidate/index', { 
		  	title: 'Candidates',
		  	id: 'candidate',
		  	candidates: values[0],
		  	presidents: values[1],
		  	counties: values[2],
		  	constituencies: values[3],
		  	mps: values[4]
		});
	});
});

router.get('/create',roles.admin, function(req, res, next) {
	var regions = Region.findAll();;
	var categories = Category.findAll();
	Promise.all([regions, categories]).then(values => { 
	  	res.render('candidate/create', { 
			title: 'Create Candidate',
			regions: values[0],
			categories: values[1]
		});
	});  
});

router.get('/update/:id',roles.admin, function(req, res, next) {
	var regions = Region.findAll();;
	var categories = Category.findAll();
	var candidate = Candidate.findOne({
		where: {
            id: req.params.id
        },
        include: [
	        { 
	        	model: Region, as: 'region',
	    	}
	    ]
	});
	Promise.all([regions, categories, candidate]).then(values => { 
	  	res.render('candidate/update', { 
			title: 'Update Candidate: '+ values[2].name,
			regions: values[0],
			categories: values[1],
			candidate: values[2],
			id: req.params.id
		});
	});  
});

router.get('/delete/:id',roles.admin, function(req, res, next) {
	var candidate = Candidate.findOne({
		where: {
            id: req.params.id
        }
	}).then(function(cand){
		cand.destroy();
		res.redirect('/candidate');
	});
	
});

router.post('/update',roles.admin, function(req, res, next) {
	var name = req.body.name;
	var region = req.body.region;
	var position = req.body.position;
	var odd = req.body.odd;
	var prob = req.body.probability;
	var id = req.body.id;

	req.checkBody('name','Should not be empty').notEmpty();
	req.checkBody('category','Should not be empty').notEmpty();
	req.checkBody('odd','Should not be empty').notEmpty();
	req.checkBody('probability','Should not be empty').notEmpty();
	req.checkBody('position','Should not be empty').notEmpty();

	Candidate.findById(id).then(function(candidate){
		candidate.update({
	  		name: name,
			regionId:region,
			odd:odd,
			position: position,
			probability: prob
	  	}).then(function(){
	  		res.redirect('/candidate');
	  	}).catch(function(err){
	  		console.log(err.errors);
	  		res.render('candidate/index', { 
				title: 'Error',
				errors: err.errors[0].message,
			});
	  	});
	});
});

router.post('/create',roles.admin, function(req, res, next) {
	var name = req.body.name;
	var region = req.body.region;
	var position = req.body.position;
	var odd = req.body.odd;
	var prob = req.body.probability;

	req.checkBody('name','Should not be empty').notEmpty();
	req.checkBody('category','Should not be empty').notEmpty();
	req.checkBody('odd','Should not be empty').notEmpty();
	req.checkBody('probability','Should not be empty').notEmpty();
	req.checkBody('position','Should not be empty').notEmpty();

	Candidate.create({
		name: name,
		regionId:region,
		odd:odd,
		position: position,
		probability: prob
	}).then(function(){
		res.redirect('/candidate');
	}).catch(function(err){
		res.render('candidate/index', { 
			title: 'Error',
			errors: err.errors[0].message,
		});
	});
});

module.exports = router;