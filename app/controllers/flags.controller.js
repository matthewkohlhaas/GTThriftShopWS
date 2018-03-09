var authentication = require('../utils/authentication.utils');
var ListingFlag = require('mongoose').model('ListingFlag');
var Ticket = require('mongoose').model('Ticket');
var User = require('mongoose').model('User');

exports.flagListing = function(req, res, next) {
    var listing = req.body.listing;
    var description = (req.body.description) ? req.body.description.trim() : '';
    var user = authentication.getUserFromToken(req); //user who flagged listing

    //authenticate
    if (!user) {
        res.status(401).send('unauthorized');
    } else if (!listing) {
        res.status(400).send({successful: false, text: 'Please provide a listing to flag.'});
    } else if (description === '') {
        res.status(400).send({successful: false,
            text: 'Please provide a reason/description for flagging this listing.'});
    } else {
        new ListingFlag({
            description: description,
            listing: listing._id,
            user: user._id

    }).save(function(err) {
            if (err) {
                res.status(500).send({successful: false, text: 'Failed to flag the listing, ' + listing.name + '.'});
            } else {
                res.status(200).send({successful: true, text: 'The listing, ' + listing.name + ' has been flagged.'});
            }
        });
    }
};