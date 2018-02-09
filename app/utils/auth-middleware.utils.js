var AuthUtils = require('./authentication.utils');

exports.authenticateTokenMiddleware = function(req, res, next) {
    if (AuthUtils.authenticateToken(req)) {
        next();
    } else {
        return res.status(401).send('unauthorized');
    }
};
