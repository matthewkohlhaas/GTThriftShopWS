var verification = require('../utils/verification.util');
var Listing = require('mongoose').model('Listing');

exports.list = function(req, res, next) {
    if (!verification.getToken(req)) {
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

// exports.create = function(req, res, next) {
//     var listing = new Listing(req.body);
//     listing.save(function(err) {
//         if (err) {
//             return next(err);
//         } else {
//             res.json(listing);
//         }
//     });
// };