var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var passport = require('passport');

module.exports = function() {
    var app = express();

    app.use(cors());

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(bodyParser.json());

    app.use(morgan('tiny'));

    app.use(passport.initialize());

    require('../app/routes/index.routes.js')(app);
    require('../app/routes/users.routes.js')(app);
    require('../app/routes/listings.routes.js')(app);

    app.use(express.static('./public'));

    return app;
};