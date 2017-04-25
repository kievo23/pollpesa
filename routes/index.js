var express = require('express');
var router = express.Router();
var connection = require(__dirname + '/../config/db'); 
var moment = require('moment');

/* GET home page. */
router.get('/', function(req, res, next) {
  var today = moment();
  var yesterday = moment().subtract(1, 'days');
  var endOfLastSevenDays = moment().subtract(7,'days');
  var startOfLastWeek = moment().subtract(1,'weeks').startOf('isoweek');
  var endOfLastWeek = moment().subtract(1,'weeks').endOf('isoweek');

  var yesterday = connection.query('select count(distinct "userId"),candidateid,c.name,c.odd,c.position from betdetails as d \
	left join bets as b on b.id = d.betid \
	left join candidates as c on c.id = d.candidateid \
	where "d"."createdAt" >= \''+yesterday.format()+'\' AND "d"."createdAt" <= \''+today.format()+'\' \
	group by candidateid, c.name, c.odd,c.position',
	      { type: connection.QueryTypes.SELECT }
    );
  var lastSevenDays = connection.query('select count(distinct "userId"),candidateid,c.name,c.odd,c.position from betdetails as d \
	left join bets as b on b.id = d.betid \
	left join candidates as c on c.id = d.candidateid \
	where "d"."createdAt" >= \''+endOfLastSevenDays.format()+'\' AND "d"."createdAt" <= \''+today.format()+'\' \
	group by candidateid, c.name, c.odd,c.position',
	      { type: connection.QueryTypes.SELECT }
    );
  var lastweek = connection.query('select count(distinct "userId"),candidateid,c.name,c.odd,c.position from betdetails as d \
	left join bets as b on b.id = d.betid \
	left join candidates as c on c.id = d.candidateid \
	where "d"."createdAt" >= \''+startOfLastWeek.format()+'\' AND "d"."createdAt" <= \''+endOfLastWeek.format()+'\' \
	group by candidateid, c.name, c.odd,c.position',
	      { type: connection.QueryTypes.SELECT }
    );
  var overall = connection.query('select count(distinct "userId"),candidateid,c.name,c.odd,c.position from betdetails as d \
	left join bets as b on b.id = d.betid \
	left join candidates as c on c.id = d.candidateid \
	group by candidateid, c.name, c.odd,c.position',
	      { type: connection.QueryTypes.SELECT }
    );
  Promise.all([yesterday,lastSevenDays, lastweek, overall]).then(values => {
  		console.log(values[0]);
	  res.render('index', { 
	  	title: 'Kenyan Elections Virtual Bets',
	  	id:"top",
	  	yesterdays: values[0],
	  	lastSevenDays: values[1],
	  	lastweek: values[2],
	  	overall: values[3]
	  });
  });
});

module.exports = router;