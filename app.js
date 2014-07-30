// REQUIRED
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mailer = require('express-mailer');
var escape = require('escape-html');


// DB CONFIG
var mongo = require('mongoskin');
var db = mongo.db("mongodb://188.226.249.240:27019/theatre", {native_parser:true});

// ROUTES IMPORT
var routes = require('./routes/index');

// GENERATE APP
var app = express();

// VIEW ENGINE SETUP
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 9989);

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// SERVER
var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});

// MAILER
mailer.extend(app, {
  from: 'no-reply@theatredenamur.be',
  host: 'smtp.gmail.com', // hostname
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: 'confirmation.theatre@gmail.com',
    pass: 'V53H92Z8J8E6163RNC8M'
  }
});

// ADD HEADERS
app.use(function (req, res, next) {

    // ALLOW CONNECTION
    res.setHeader('Access-Control-Allow-Origin', '*');

    // ALLOW METHODS
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // ALLOW HEADERS
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // ALLOW COOKIES
    res.setHeader('Access-Control-Allow-Credentials', true);

    // NEXT
    next();
});

// DB & SOCKET ACCESS
app.use(function(req,res,next){
    req.db = db; // db accessible to our router
    req.mailer = mailer; // mailer accessible to our router
    next();
});

// ROUTES
// app.use('/', routes);

// POST :: add a new user & order
app.post('/order', function(req, res) {

    var db = req.db;
    var user = req.body.user;

    // escape HTML
    user.comment = escape(user.comment);


    user.group = req.body.group;

    db.collection('users').insert(user, function(error, result){
        if(error){
            res.json(error);
        }
        var new_user = result[0];
        var order = {
            user:new_user._id,
            orders:req.body.orders
        };
        for(o in req.body.orders){
            req.body.orders[o].comment = escape(req.body.orders[o].comment); // escape HTML
            req.body.orders[o].classe = (req.body.orders[o].tickets[0].class == 'A') ? 'en Première classe' : '';
        }
        var people = 0;
        for(var g in req.body.group){
            if(req.body.group[g] != '0' && req.body.group[g] != 0)
            people += parseInt(req.body.group[g]);
        }
        if(people == 1){
            people = people.toString() + ' personne'
        }
        else{
            people = people.toString() + ' personnes'
        }
        db.collection('orders').insert(order, function(error, result){
            app.mailer.send('email', {
                to: req.body.user.email, // REQUIRED. This can be a comma delimited string just like a normal email to field. 
                subject: 'Confirmation de votre réservation au prochain programme du THEATRE DE NAMUR', // REQUIRED.
                amount:req.body.total,
                orders:req.body.orders,
                people:people
                }, function (err) {
                    // COPY
                    app.mailer.send('email', {
                        to:'alexis.bedoret@gmail.com,emmanuel.bedoret@skynet.be', // REQUIRED
                        subject: req.body.user.email + ': Confirmation de réservation au prochain programme du THEATRE DE NAMUR', // REQUIRED.
                        amount:req.body.total,
                        orders:req.body.orders,
                        people:people
                        }, function (err){
                            console.log(err);
                        });

                    if (err) {
                      // handle error
                      console.log(err);
                      res.send('There was an error sending the email');
                      return;
                    }
                    res.send('Email Sent');
            });
            res.json({
                error:error,
                response:result
            });
        });
    });
});

// POST :: add a new user // BRASS MONKEY - TMP
app.post('/api/brassmonkey/newsletter', function(req, res) {

    var db = req.db;
    var user = req.body.user;

    // escape HTML
    user.firstname = escape((user.firstname) ? user.firstname : 'test');
    user.lastname = escape((user.lastname) ? user.lastname : 'test');
    user.email = escape((user.email) ? user.email : 'test');

    db.collection('bm_users').insert(user, function(error, result){

        console.log({
            error:error,
            response:result
        });
        res.json({
            error:error,
            response:result
        });
    });
});

// GET :: get a list of all events
app.get('/events', function(req, res) {
    var db = req.db;
    db.collection('events').find().toArray(function (error, items) {
        res.json(items);
    });
});

/// 404
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
