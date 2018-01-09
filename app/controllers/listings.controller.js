var Listing = require('mongoose').model('Listing');

exports.create = function(req, res, next) {
    var listing = new Listing(req.body);
    listing.save(function(err) {
        if (err) {
            return next(err);
        } else {
            res.json(listing);
        }
    });
};

exports.list = function(req, res, next) {
    Listing.find({}, function(err, listings) {
        if (err) {
            return next(err);
        } else {
            res.json(listings);
        }
    }).populate('user');
};