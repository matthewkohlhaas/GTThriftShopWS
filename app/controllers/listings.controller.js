var verification = require('../utils/authentication.utils');
var Listing = require('mongoose').model('Listing');

exports.list = function (req, res, next) {
    if (!verification.authenticateToken(req)) {
        return res.status(401).send('unauthorized');
    } else {
        Listing.find({}, function (err, listings) {
            if (err) {
                return next(err);
            } else {
                res.json(listings);
            }
        }).populate('user');
    }
};