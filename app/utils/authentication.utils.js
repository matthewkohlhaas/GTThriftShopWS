var jwt = require('jsonwebtoken');
var config = require('../../config/config');

exports.getToken = function(req) {
    if (req.headers && req.headers.authorization) {
        return req.headers.authorization
    }
};

exports.getUserFromToken = function(req) {
    var token = this.getToken(req);
    if (token) {
        try {
            return jwt.verify(token, config.secret);
        } catch(err) {
            return null;
        }
    } else {
        return null;
    }
};

exports.authenticateToken = function(req) {
    return this.getUserFromToken(req) !== null;
};