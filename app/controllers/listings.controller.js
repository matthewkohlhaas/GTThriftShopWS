var authentication = require('../utils/authentication.utils');
var Listing = require('../models/listing.model');

exports.list = function (req, res, next) {
    Listing.find({}, function (err, listings) {
        if (err) {
            return next(err);
        } else {
            res.json(listings);
        }
    }).populate('user');
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
    Listing.findOne({_id: req.params.listing}, function (err, listing) {
        if (err) {
            res.status(500).send({successful: false, text: err.message});
        } else if (!listing) {
            res.status(400).send({successful: false, text: 'Can not find listing :/'});
        } else {
            res.json(listing);
        }
    }).populate('user');
};


exports.editListing = function (req, res, next) {
    Listing.findOne({_id: req.body.listing}, function (err, listing) {
        if (err) {
            res.status(500).send({successful: false, text: err.message});
        } else if (!listing) {
            res.status(400).send({successful: false, text: 'Can not find listing :/'});
        } else {
            listing.name = req.body.name;
            listing.description = req.body.description;
            listing.price = req.body.price;
            listing.imageUrl = req.body.imageUrl;
            listing.save(function (err) {
                if (err) {
                    res.status(500).send({successful: false, text: err.message});
                } else {
                    res.status(200).send({successful: true, text: 'Edited Succesfully!'});
                }
            });
        }
    }).populate('user');

};


