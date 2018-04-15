const authentication = require('../utils/authentication.utils');
const Listing = require('../models/listing.model');
const User = require('../models/user.model');
const Offer = require('../models/offer.model');
const listUtils = require('../utils/listings.utils');
const ObjectId = require('mongodb').ObjectID;
const arrayContains = require('array-contains');

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

exports.processPrice = function (req, res, next) {
    const price = (req.body.price) ? parseFloat(req.body.price).toFixed(2) : req.body.price;
    if (price) {
        req.body.price = price;
        return next();
    }
    return res.status(400).send({successful: false, text: 'Please provide a price.'});
};

exports.createOffer = function (req, res, next) {
    Listing.findById(req.params.id).populate('user').exec(function (err, listing) {
        if (err) {
            res.status(500).send({successful: false, text: err.message});

        } else if (!listing) {
            res.status(400).send({successful: false, text: 'Cannot find listing :/'});

        } else if (arrayContains(listing.user.blockedUsers, req.body.user._id)) {
            res.status(403).send({successful: false, text: 'You cannot make offer on this listing. You are blocked by '
                + 'the listing owner.'});
        } else {
            User.findById(req.body.user._id, function (err, user) {
                if (err) {
                    res.status(500).send({successful: false, text: err.message});
                } else if (!user) {
                    res.status(400).send({successful: false, text: 'Cannot find user :/'});
                } else {
                    const price = req.body.price;
                    const messages = [{
                        author: req.body.user._id,
                        text: req.body.message
                    }];
                    new Offer({
                        user: req.body.user._id,
                        price: price,
                        listing: listing._id,
                        messages: messages
                    }).save(function (err, offer) {
                        if (err) {
                            res.status(500).send({successful: false, text: 'Failed to make offer of $' + price});
                        } else {
                            listing.offers.push(offer._id);
                            listing.save();
                            user.offers.push(offer._id);
                            user.save();
                            res.status(200).send({successful: true, text: 'You made an offer of $' + price});
                        }
                    });
                }
            });
        }
    });
};

exports.getOffers = function (req, res, next) {
    Listing.findById(req.params.id).populate('user').populate('offers').exec(function (err, listing) {
        if (err) {
            res.status(500).send({successful: false, text: err.message});

        } else if (!listing) {
            res.status(400).send({successful: false, text: 'Cannot find listing :/'});

        } else if (arrayContains(listing.user.blockedUsers, req.body.user._id)) {
            res.status(403).send({successful: false, text: 'You cannot get offers for this listing. You are blocked by '
                + 'the listing owner.'});

        } else if (req.body.user._id === listing.user._id.toString()) {
            res.status(200).json(listing.offers);

        } else {
            const offers = [];
            for (var i = 0; i < listing.offers.length; i++) {
                var curr = listing.offers[i];
                if (curr.user.toString() === req.body.user._id) {
                    offers.push(curr);
                }
            }
            res.status(200).json(offers);
        }
    });
};
