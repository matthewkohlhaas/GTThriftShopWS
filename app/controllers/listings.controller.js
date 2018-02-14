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

exports.createListing = function(req, res, next) {
    var name = (req.body.name) ? req.body.name.trim() : '';
    var price = req.body.price;
    var description = (req.body.description) ? req.body.description.trim() : '';
    var imageUrl = (req.body.imageUrl) ? req.body.imageUrl.trim() : '';
    console.log(description);
    var user = authentication.getUserFromToken(req);

    //authenticate
    if (!user) {
        res.status(401).send('unauthorized');
    } else if (name === '') {
        res.status(400).send({successful: false, text: 'Please provide a name.'});
    } else {
        new Listing({
            name: name,
            description: description,
            price: price,
            imageUrl: imageUrl,
            user: user._id

        }).save(function(err) {
            if (err) {
                console.log('fail');
                res.status(500).send({successful: false, text: 'Failed to create listing:.' + name});
            } else {
                console.log('success');
                res.status(200).send({successful: true, text: 'Created listing:' + name + '!'});
            }
        });
    }
};

exports.getById = function(req, res, next) {

}