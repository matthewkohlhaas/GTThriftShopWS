const AuthUtils = require('./authentication.utils');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');

exports.authenticateToken = function(req, res, next) {
    if (AuthUtils.authenticateToken(req)) {
        next();
    } else {
        return res.status(401).send('unauthorized');
    }
};

exports.getUserFromToken = function(req, res, next) {
    var token = AuthUtils.getToken(req);
    if (token) {
        try {
            req.body.user = jwt.verify(token, config.secret);
            return next();
        } catch(err) {
            return res.status(401).send('unauthorized');
        }
    }
    return res.status(401).send('unauthorized');
};
