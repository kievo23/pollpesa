var express = require('express');
var router = express.Router();

var Region = require(__dirname + '/../models/Region');
var Category = require(__dirname + '/../models/Category');
var roles = require(__dirname + '/../config/roles');

/* GET home page. */
router.get('/',roles.admin, function(req, res, next) {
	Region.findAll({ 
	    include: [
	        { model: Category, as: 'category'}
	    ]
	})
	.then(function(regions){
  		res.render('region/index', { 
		  	title: 'Regions',
		  	regions: regions,
		  	id:"top"
		});
  	});
});

router.get('/create',roles.admin, function(req, res, next) {
	
	Category.findAll().then(function(categories){
		res.render('region/create', { 
			title: 'Create Category',
			categories: categories
		});
  	});
  
});

router.get('/update/:id',roles.admin, function(req, res, next) {
	Region.findOne({
		where: {
            id: req.params.id
          },
		 include: [
	        { model: Category, as: 'category'}
	    ]
	}).then(function(region){
      Category.findAll().then(function(categories){
		res.render('region/update', { 
			title: 'Update Category',
			region: region,
			categories: categories,
			id: req.params.id
		});
  	  });
    });  
});

router.post('/update/:id',roles.admin,function(req, res, next) {
	var name = req.body.name;
	var category = req.body.category;
	var id = req.body.id;

	req.checkBody('name','Should not be empty').notEmpty();
	req.checkBody('category','Should not be empty').notEmpty();

	Region.findById(id).then(function(region){
		region.update({
			name: name,
			categoryId:category
		}).then(function(){
			res.redirect("/region");
		}).catch(function(err){
			res.render('region/index', { 
				title: 'Error',
				errors: err.errors[0].message,
			});
		});
	});
});

router.post('/create',roles.admin, function(req, res, next) {
	var name = req.body.name;
	var category = req.body.category;

	req.checkBody('name','Should not be empty').notEmpty();
	req.checkBody('category','Should not be empty').notEmpty();

	Region.create({
		name: name,
		categoryId:category
	}).then(function(){
		res.redirect("/");
	}).catch(function(err){
		res.render('region/index', { 
			title: 'Error',
			errors: err.errors[0].message,
		});
	});
});

module.exports = router;