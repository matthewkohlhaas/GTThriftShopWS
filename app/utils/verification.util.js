var jwt = require('jsonwebtoken');
var config = require('../../config/config');

exports.getToken = function(req) {
    if (req.headers && req.headers.authorization) {
        return req.headers.authorization
    }
};

exports.getUser = function(req) {
    var token = this.getToken(req);
    if (token) {
        try {
            var user = jwt.verify(token, config.secret);
            console.log(user);
            return user;
        } catch(err) {
            return null;
        }
    } else {
        return null;
    }
};

exports.verifyToken = function(req) {
    return this.getUser(req) !== null;
};