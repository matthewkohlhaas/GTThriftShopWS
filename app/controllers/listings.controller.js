var authentication = require('../utils/authentication.utils');
var Listing = require('../models/listing.model');

exports.list = function (req, res, next) {
    if (!authentication.authenticateToken(req)) {
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