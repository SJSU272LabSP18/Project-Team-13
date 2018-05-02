var express = require('express');
var path = require('path');
var cors = require('cors');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var index = require('./routes/index');
var users = require('./routes/users');
var es = require('./routes/es')

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(cors ({
    //origin: 'http://ec2-13-56-51-167.us-west-1.compute.amazonaws.com:3000',
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Added to support session storing in database
var options = {
    host: 'weserveinstance.ccecdywbwqqr.us-west-1.rds.amazonaws.com',
    port: 3305,
    user: 'root',
    password: 'rootroot',
    database: 'weserve'
};

//creates sessionstore using above options
var sessionStore = new MySQLStore(options);


app.use( session({
    secret : 'abhabclkjbiyvyy',
    store : sessionStore,
    duration : 30 * 60 * 1000,
    activeDuration : 5 * 60 * 1000,
    resave: false,
    saveUninitialized: false
}))

app.use('/', index);
app.use('/users', users);
app.use('/es', es)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
