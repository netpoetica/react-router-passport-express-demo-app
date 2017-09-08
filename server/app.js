// dependencies
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

var routes = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(require('express-session')({
		secret: 'keyboard cat',
		resave: false,
		saveUninitialized: false
}));
app.use(passport.initialize());
app.use(flash());
app.use(passport.session()); app.use(express.static(path.join(__dirname, '../build')));


app.use('/', routes);

// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// mongoose
mongoose.connect('mongodb://localhost/passport_local_mongoose_express4');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
		app.use(function(err, req, res, next) {
				res.status(err.status || 500);
				res.json({
						message: err.message,
						error: err
				});
		});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.json({
				message: err.message,
				error: {}
		});
});

module.exports = app;
