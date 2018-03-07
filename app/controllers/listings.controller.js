var authentication = require('../utils/authentication.utils');
var Listing = require('../models/listing.model');
var listUtils = require('../utils/listings.utils');

exports.list = function (req, res, next) {
    var query = Listing.find({}).populate('user');
    listUtils.addSortToQuery(query, req);
    query.exec(function (err, listings) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            req.listings = listings;
            next();
        }
    });
};

exports.postProcessListings = function (req, res) {
    listUtils.postProcessSort(req);
    return res.status(200).send(req.listings);
};

exports.createListing = function(req, res, next) {
    var name = (req.body.name) ? req.body.name.trim() : '';
    var price = (req.body.price) ? parseFloat(req.body.price).toFixed(2) : req.body.price;
    var description = (req.body.description) ? req.body.description.trim() : '';
    var imageUrl = (req.body.imageUrl) ? req.body.imageUrl.trim() : '';
    var user = authentication.getUserFromToken(req);

    //authenticate
    if (!user) {
        res.status(401).send('unauthorized');
    } else if (name === '') {
        res.status(400).send({successful: false, text: 'Please provide a name.'});
    } else if (price && isNaN(price)) {
        res.status(400).send({successful: false, text: 'Please provide a valid price.'});
    } else {
        new Listing({
            name: name,
            description: description,
            price: price,
            imageUrl: imageUrl,
            user: user._id

        }).save(function(err) {
            if (err) {
                res.status(500).send({successful: false, text: 'Failed to create listing:.' + name});
            } else {
                res.status(200).send({successful: true, text: 'Created listing:' + name + '!'});
            }
        });
    }
};

exports.getById = function(req, res, next) {

};
