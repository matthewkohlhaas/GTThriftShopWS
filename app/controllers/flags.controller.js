var authentication = require('../utils/authentication.utils');
var User = require('../models/user.model');
var Listing = require('../models/listing.model');
var ListingFlag = require('mongoose').model('ListingFlag');
var UserFlag = require('mongoose').model('UserFlag');

exports.flagListing = function(req, res, next) {
    var listingId = req.body.listingId;
    var description = (req.body.description) ? req.body.description.trim() : '';
    var user = authentication.getUserFromToken(req);

    if (!user) {
        res.status(401).send('unauthorized');
    } else if (!listingId) {
        res.status(400).send({successful: false, text: 'Please provide a listing to flag.'});
    } else if (description === '') {
        res.status(400).send({successful: false,
            text: 'Please provide a reason for flagging this listing.'});
    } else {
        Listing.findById(listingId, function (err, listing) {
            if (err || !listing) {
                res.status(400).send({successful: false, text: 'Could not find the listing you wish to flag.'});
            } else {
                new ListingFlag({
                    description: description,
                    flaggedListing: listingId,
                    user: user._id

                }).save(function(err) {
                    if (err) {
                        res.status(500).send({successful: false, text: 'Failed to flag the listing, ' + listing.name
                            + '.'});
                    } else {
                        res.status(200).send({successful: true, text: 'The listing, ' + listing.name
                            + ' has been flagged.'});
                    }
                });
            }
        });
    }
};

exports.flagUser = function(req, res, next) {
    var userId = req.body.userId;
    var description = (req.body.description) ? req.body.description.trim() : '';
    var user = authentication.getUserFromToken(req);

    if (!user) {
        res.status(401).send('unauthorized');
    } else if (!userId) {
        res.status(400).send({successful: false, text: 'Please provide a user to flag.'});
    } else if (description === '') {
        res.status(400).send({successful: false,
            text: 'Please provide a reason for flagging this user.'});
    } else {
        User.findById(userId, function (err, user) {
            if (err || !user) {
                res.status(400).send({successful: false, text: 'Could not find the user you wish to flag.'});
            } else {
                new UserFlag({
                    description: description,
                    flaggedUser: userId,
                    user: user._id

                }).save(function(err) {
                    if (err) {
                        res.status(500).send({successful: false, text: 'Failed to flag the user, ' + user.firstName
                            + ' ' + user.lastName + '.'});
                    } else {
                        res.status(200).send({successful: true, text: 'The user, ' + user.firstName + ' '
                            + user.lastName + ' has been flagged.'});
                    }
                });
            }
        });
    }
};
