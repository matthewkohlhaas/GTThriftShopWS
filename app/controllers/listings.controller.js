var verification = require('../utils/verification.util');
var Listing = require('mongoose').model('Listing');

exports.list = function(req, res, next) {
    console.log(req.headers.authorization);
    if (!verification.verifyToken(req)) {
        return res.status(401).send('unauthorized');
    } else {
        Listing.find({}, function(err, listings) {
            if (err) {
                return next(err);
            } else {
                res.json(listings);
            }
        }).populate('user');
    }
};