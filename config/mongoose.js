var config = require('./config');
var mongoose = require('mongoose');

module.exports = function() {
    var db = mongoose.connect(config.db);
    require('../app/models/user.model');
    require('../app/models/verification-token.model');
    require('../app/models/password-reset-token.model');
    require('../app/models/listing.model');
    return db;
};