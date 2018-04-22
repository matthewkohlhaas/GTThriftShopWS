const jwt = require('jsonwebtoken');
const config = require('../../config/config');

exports.getToken = function(req) {
    if (req && req.headers && req.headers.authorization) {
        return req.headers.authorization;
    }
    return null;
};

exports.getUserFromToken = function(req) {
    var token = this.getToken(req);
    if (token) {
        try {
            return jwt.verify(token, config.secret);
        } catch(err) {
            return null;
        }
    }
    return null;
};

exports.authenticateToken = function(req) {
    return this.getUserFromToken(req) !== null;
};