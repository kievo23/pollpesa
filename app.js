'use strict'
const https = require('https');
const http = require('http');
const fs = require('fs');
const options = {
  key: fs.readFileSync('privkey.pem','utf8'),
  cert: fs.readFileSync('fullchain.pem','utf8')
};

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var flash = require('connect-flash');
var expressValidator = require('express-validator');
var bcrypt = require('bcryptjs');
var User = require('./models/userModel');
var Bet = require('./models/Bet');

var index = require('./routes/index');
var users = require('./routes/users');
var category = require('./routes/category');
var region = require('./routes/region');
var candidate = require('./routes/candidate');
var bets = require('./routes/bets');
var betdetails = require('./routes/betdetails');
var news = require('./routes/news');
var polls = require('./routes/polls');
var webpack = require("webpack");
var back = require('express-back');  
var moment = require('moment');
var connection = require('./config/db');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ 
  secret: 'keyboardcat',
  resave: true,
  saveUninitialized: false,
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(back());

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id).then(function(user){
    done(null, user);
  });
});


passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password'
  },
  function(username, password, done) {
    User.findOne({where:{ username: username }}).then(function(user){
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!bcrypt.compareSync(password, user.password)) {        
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    }).catch(function(err){
      console.log(err);
    });
  }
));

app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  if(req.body.candidates != null){
    res.locals.cid = req.body.candidates;
  }
  if(req.user != null){
    var bets = Bet.findAll({
        where:{
          userId: req.user.id,
          winstatus: "0"
        },
        order: [['createdAt', 'DESC']]
       });
      var count = Bet.count({
          where: {
            userId: req.user.id
          }
      });
      Promise.all([bets,count]).then(values => {
        res.locals.betCount = values[1];
        res.locals.pendingBets = values[0];
        next();
      });
  }else{
     next();
  }
});

app.use('/', index);
app.use('/users', users);
app.use('/category', category);
app.use('/region', region);
app.use('/candidate', candidate);
app.use('/bet', bets);
app.use('/betdetails', betdetails);
app.use('/news', news);
app.use('/poll', polls);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log("middleware is working");
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.get('/login', function(req, res){
  res.render('login');
});

app.get('/register', function(req, res){
  res.render('register');
});

app.post('/register', function(req, res){
  var names = req.body.names;
  var phone = req.body.phone;
  var password = req.body.password;
  var role = 0;
  var credits =1000;

  //Validations
  req.checkBody('names','names can not be empty').notEmpty();
  req.checkBody('phone','phone can not be empty').notEmpty();
  req.checkBody('phone','phone should be a number').isInt();
  req.checkBody('password','password can not be empty').notEmpty();
  req.checkBody('cpassword','password did not match').equals(req.body.password);

  var errors = req.validationErrors();
  if(errors){
    res.render('register',{errors: errors});
  }else{
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    User.create({
      username: phone,
      names: names,
      password: hash,
      phone: phone,
      role: role,
      credits: credits
    }).then(function(){
      res.render('index',{
        message: "Record inserted successfully",
        title: "Welcome"
      });
    }).catch(function(err){
      res.render('index',{
        errors: err.errors[0].message,
        title: "Error"
      });
    });
  }
});

app.get('/logout', function(req, res){
  req.logout();
  req.flash("success_msg","now logged out");
  res.redirect('/');
});

app.post('/login', passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true })
  , function(req, res){
    res.locals.msg = "this is awesome";
    app.locals.user = req.user || null;
    res.redirect("candidate");

});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});




//module.exports = app;
app.listen(3000,function(){
	console.log("listening on port 3000");
});

const serverone = http.createServer(app).listen(8000, function(err) {
  if (err) {
    console.log(err);
  } else {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`Server listening on ${host}:${port}`);
  }
});

const server = https.createServer(options, app).listen(8080, function(err) {
  if (err) {
    console.log(err);
  } else {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`Server listening on ${host}:${port}`);
  }
});