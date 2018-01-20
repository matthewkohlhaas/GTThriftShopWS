var config = require('./config');
var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var morgan = require('morgan');

module.exports = function() {
    var app = express();

    // Add headers
    app.use(function (req, res, next) {

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', config.origin);

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
        next();
    });

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(bodyParser.json());

    app.use(passport.initialize());

    require('../app/routes/index.routes.js')(app);
    require('../app/routes/users.routes.js')(app);
    require('../app/routes/listings.routes.js')(app);

    app.use(express.static('./public'));

    return app;
};