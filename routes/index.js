var express = require('express');
var router = express.Router();
var connection = require(__dirname + '/../config/db'); 
var moment = require('moment');
var Candidate = require(__dirname + '/../models/Candidate');
var Region = require(__dirname + '/../models/Region');
var News = require(__dirname + '/../models/News');
var Polls = require(__dirname + '/../models/Poll');
var PollOption = require(__dirname + '/../models/Polloption');

/* GET home page. */

router.get('/winners', function(req, res, next){
	connection.query('select id,full_names, max(credits) as credits from users where credits is not null group by full_names,credits,id order by credits desc limit 10',
	    { type: connection.QueryTypes.SELECT }).then(function(winners){
	      	res.render('site/winners', { 
			  	title: 'Overall Top 10 Winners',
			  	winners: winners
			  });
	    });
});

router.get('/counties', function(req, res, next){
	Region.findAll({
		where: {
			categoryId : 1
		}
	}).then(function(counties){
		console.log(counties);
		res.render('site/counties', { 
		  	title: 'Counties',
		  	counties: counties
		});
	})
});

router.get('/', function(req, res, next) {
  var today = moment()
  var yesterday = moment().subtract(1, 'days')
  var endOfLastSevenDays = moment().subtract(7,'days');
  var startOfLastWeek = moment().subtract(1,'weeks').startOf('isoweek');
  var endOfLastWeek = moment().subtract(1,'weeks').endOf('isoweek');

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

	var mps = Candidate.findAll({ 
	    where: {
			position: 'MP'
		},
		include: [
	        { model: Region, as: 'region'}
	    ]
	});

  var yesterday = connection.query('select count(distinct "userId"),candidateid,c.name,c.odd,c.position from betdetails as d \
	left join bets as b on b.id = d.betid \
	left join candidates as c on c.id = d.candidateid \
	where "d"."createdAt" >= \''+yesterday.format()+'\' AND "d"."createdAt" <= \''+today.format()+'\' \
	group by candidateid, c.name, c.odd,c.position order by count DESC limit 5',
	      { type: connection.QueryTypes.SELECT }
    );
  var lastSevenDays = connection.query('select count(distinct "userId"),candidateid,c.name,c.odd,c.position from betdetails as d \
	left join bets as b on b.id = d.betid \
	left join candidates as c on c.id = d.candidateid \
	where "d"."createdAt" >= \''+endOfLastSevenDays.format()+'\' AND "d"."createdAt" <= \''+today.format()+'\' \
	group by candidateid, c.name, c.odd,c.position order by count DESC limit 5',
	      { type: connection.QueryTypes.SELECT }
    );
  var presidential = connection.query('select count(distinct "userId"),candidateid,c.name,c.odd,c.position from betdetails as d \
	left join bets as b on b.id = d.betid \
	left join candidates as c on c.id = d.candidateid \
	where "c"."regionId" = 97 group by candidateid, c.name, c.odd,c.position order by count DESC limit 5',
	      { type: connection.QueryTypes.SELECT }
    );
  var overall = connection.query('select count(distinct "userId"),candidateid,c.name,c.odd,c.position from betdetails as d \
	left join bets as b on b.id = d.betid \
	left join candidates as c on c.id = d.candidateid \
	group by candidateid, c.name, c.odd,c.position order by count DESC limit 5',
	      { type: connection.QueryTypes.SELECT }
    );
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
  var news = News.findAll({
  	order: [['createdAt', 'DESC']],
  	limit: 5
  });
  var polls = Polls.findAll({
  	order: [['createdAt', 'DESC']],
  	limit: 5
  })
  var options = PollOption.findAll()

  Promise.all([yesterday,lastSevenDays, presidential, overall, candidates, presidents, counties, constituencies, mps, news, polls, options]).then(values => {
  		res.render('index', { 
		  	title: 'Kenyan Elections Virtual Bets',
		  	id: "top",
		  	yesterdays: values[0],
		  	lastSevenDays: values[1],
		  	presidential: values[2],
		  	overall: values[3],
		  	candidates: values[4],
		  	presidents: values[5],
		  	counties: values[6],
		  	constituencies: values[7],
		  	mps: values[8],
		  	news: values[9],
		  	polls: values[10],
		  	options: values[11]
		});
	});
});

module.exports = router;
