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

/* GET home page. */
router.get('/',function(req,res,next){
     Bet.findAll({
     	where:{
     		userId: req.user.id
     	},
     	order: [['createdAt', 'DESC']]
     })
     .then(function(bets){
        res.render('bets/index', { 
			title: 'My Bets',
			bets: bets,
		});
     })
     .catch(function(err){
         console.log(err);
     })
});

router.post('/fetch',roles.auth,function(req,res,next){
     connection.query('SELECT betdetails.*,candidates.* FROM betdetails LEFT JOIN candidates ON betdetails.candidateid=candidates.id where betdetails.betid=:bet',
		  { replacements: { bet: req.body.betId  },type: connection.QueryTypes.SELECT }
		)
     .then(function(bets){
        res.json(bets);
     })
     .catch(function(err){
         console.log(err);
     })
});

router.post('/place',roles.auth,function(req,res,next){
	userids = JSON.parse("[" + req.body.cids + "]");
	price = req.body.price;
	totalWinnings = 0;
	candidates = {};
	res.locals.cid = null;
	Candidate.findAll({
		where: {'id': {in: userids}},
	})
	.then(function(candidates){
		var amount = 0;
        candidates.forEach(function(entry) {
		    amount += parseFloat(entry.odd);
		});
        this.totalWinnings = parseInt(amount * price);
        this.candidates = candidates;

		Bet.create({
           amount: this.totalWinnings,
           userId : req.user.id,
           winstatus: 0,
           status: 0,
           initial: price
		})
		.then(function(bet){
			candidates.forEach(function(entry) {
				Betdetails.create({
					odd: entry.odd,
					status: "0",
					betid: bet.dataValues.id,
					candidateid: entry.id
             	})
             	.then(function(Details){
             		//console.log("success!!");
             	})
             	.catch(function(err){
             		console.log(err);
             	})
			});
			res.redirect('/candidate');
		})
		.catch(function(err){
			res.end(err);
		})
	})
	.catch(function(err){
		res.end(err);
	})
});

router.post('/compute',roles.auth,function(req, res, next){
	var betD = req.body.betId;
	var win = 1;
	var betAmount = 0;
	var betInitial = 0;
	Bet.findById(betD)
	.then(function(bet){
		if(bet.winstatus == 0){
			this.betAmount = bet.amount;
			this.betInitial = bet.initial;
			Betdetails.findAll({
				where: {
					betid: bet.id
				}
			}).then(function(bets){
				bets.forEach(function(betentry){
					var candidate = Candidate.findById(betentry.candidateid);
					Promise.all([candidate]).then(values => {
						var position = values[0].position;
						var region = values[0].regionId;
						Candidate.findAll({
							where: {
								position: position,
								regionId: region
							}
						}).then(function(candidates){
							var candSize = candidates.length;
							var arrayNum = [];

								//START OF the PENNINSULA
								for (var i = candSize - 1; i >= 0; i--) {
									for (var j = parseInt(candidates[i].probability) - 1; j >= 0; j--) {
			                            arrayNum.push(candidates[i].id);	                            
			                        }
								}
								//END OF the PENNINSULA

	                        arrayNum = shuffle(arrayNum);
	                        var singleRandom = arrayNum[Math.floor(Math.random() * arrayNum.length)];
	                        //console.log("Computed and Choosen Id:"+singleRandom);

	                        //EVALUATE THE BET
	                        if(betentry.candidateid == singleRandom){
	                        	win = win * 1;
	                        	betentry.update({
	                        		status: 1
	                        	}).then(function(){
	                        		console.log("won");                        		
	                        	});
	                        }else{
	                        	win = win * 0;
	                        	betentry.update({
	                        		status: 2
	                        	}).then(function(){
	                        		console.log("lost");                        		
	                        	});
	                        }

						})
					})
				})
			});
			setTimeout(function(){                        	
	        	if(win == 1){
	        		var bt = bet.update({
	        			winstatus: 1
	        		});
	        		var usr = User.findById(req.user.id);
	        		Promise.all([bt,usr]).then(values => {
	        			usar = values[1];
	        			var rst = usar.credits + parseInt(bet.amount);
	        			usar.update({
	        				credits: rst
	        			}).then(function(){
	        				res.json(win);
	        			})
	        		});
	        	}else{
	        		var bt = bet.update({
	        			winstatus: 2
	        		});
	        		var usr = User.findById(req.user.id);
	        		Promise.all([bt,usr]).then(values => {
	        			usar = values[1];
	        			var rst = usar.credits - parseInt(bet.initial);
	        			usar.update({
	        				credits: rst
	        			}).then(function(){
	        				res.json(win);
	        			})
	        		});
	        	}
	        },2000);
		}else{
			res.json(2);
		}
	});
});

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

module.exports = router;