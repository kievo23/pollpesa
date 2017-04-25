var express = require('express');
var router = express.Router();
var Category = require(__dirname + '/../models/Category');
var roles = require(__dirname + '/../config/roles');

/* GET home page. */
router.get('/',roles.admin, function(req, res, next) {
  	Category.findAll().then(function(categories){
  		console.log(categories);
  		res.render('category/index', { 
		  	title: 'Categories',
		  	categories: categories,
		  	id: "top"
		});
  	});
});

router.get('/create',roles.admin, function(req, res, next) {
  res.render('category/create', { title: 'Create Category'});
});

router.get('/update/:id',roles.admin, function(req, res, next) {
  Category.findOne({
		where: {
            id: req.params.id
          }
	}).then(function(category){
  		res.render('category/update', { title: 'Update Category', category: category});
  	});
});

router.post('/update/:id',roles.admin, function(req, res, next) {
	 var name = req.body.name;
	var id = req.body.id;

	req.checkBody('name','Should not be empty').notEmpty();

	Category.findById(id).then(function(category){
		category.update({
			name: name
		}).then(function(){			
			res.redirect("/category");
		}).catch(function(err){
			res.render('category/index', { 
				title: 'Error',
				errors: err.errors[0].message,
			});
		});
	});
});

router.post('/create',roles.admin, function(req, res, next) {
	var name = req.body.name;

	req.checkBody('name','Should not be empty').notEmpty();
	Category.create({
		name: name
	}).then(function(){
		res.redirect('/category/');
	}).catch(function(err){
		res.render('category/index', { 
			title: 'Error',
			errors: err.errors[0].message,
		});
	});
});

module.exports = router;