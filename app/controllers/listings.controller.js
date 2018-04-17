var authentication = require('../utils/authentication.utils');
var Listing = require('../models/listing.model');
var listUtils = require('../utils/listings.utils');
var ObjectId = require('mongodb').ObjectID;
var User = require('../models/user.model');

exports.list = function (req, res, next) {
    const user = authentication.getUserFromToken(req, res);

    User.findById(user._id, function (err, user) {
        if (err) {
            res.status(500).send({successful: false, text: err.message});
        } else {
            var blockedUsers = [];
            if (user) {
                blockedUsers = user.blockedUsers;
            }
            const findOptions = listUtils.generateListingsFindOptions(req, blockedUsers);

            const query = Listing.find(findOptions).populate('user');

            listUtils.addSortToQuery(query, req);

            query.exec(function (err, listings) {
                if (err) {
                    return res.status(500).send(err.message);
                } else {
                    req.listings = listings;
                    next();
                }
            });
        }
    });
};

exports.listForCurrentUser = function (req, res) {
    const user = authentication.getUserFromToken(req, res);
    const findOptions = { user: user._id };
    const query = Listing.find(findOptions).populate('user');
    const sortParam = [ 'createdAt', 'descending' ];
    query.sort([sortParam]);
    query.exec(function (err, listings) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).send(listings);
        }
    });
};

exports.allListingsForUser = function (req, res) {
    var query = Listing.find({user: req.params.userId});
    query.sort([['createdAt', 'ascending']]);
    query.exec(function (err, listings) {
        if (err) {
            res.status(500).send({successful: false, text: "Listings not found."});
        } else {
            res.status(200).send(listings);
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
    var category = Listing.schema.path('category').defaultValue;
    if (req.body.category && listUtils.isListingCategory(category)) {
        category = req.body.category;
    }

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
            category: category,
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
    Listing.findOne({_id: req.params.id}, function (err, listing) {
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
    Listing.findOne({_id: req.params.id}, function (err, listing) {
        if (err) {
            res.status(500).send({successful: false, text: err.message});
        } else if (!listing) {
            res.status(400).send({successful: false, text: 'Cannot find listing :/'});
        } else if (authentication.getUserFromToken(req)._id !== String(listing.user)) {
            res.status(403).send({successful: false, text: 'You are unauthorized to edit this listing.'});
        } else {
            if (req.body.name) {
                listing.name = req.body.name;
            }
            if (req.body.description) {
                listing.description = req.body.description;
            }
            if (req.body.price) {
                listing.price = req.body.price;
            }
            if (req.body.imageUrl) {
                listing.imageUrl = req.body.imageUrl;
            }
            if (req.body.category && listUtils.isListingCategory(req.body.category)) {
                listing.category = req.body.category;
            }
            listing.save(function (err) {
                if (err) {
                    res.status(500).send({successful: false, text: err.message});
                } else {
                    res.status(200).send({successful: true, text: 'Successfully edited listing!'});
                }
            });
        }
    });
};


