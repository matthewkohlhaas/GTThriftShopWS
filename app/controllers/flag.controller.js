var authentication = require('../utils/authentication.utils');
var Flag = require('mongoose').model('Flag');
var Ticket = require('mongoose').model('Ticket');
var User = require('mongoose').model('User');

exports.flagListing = function(req, res, next) {
    var listing = (req.body.listing) ? (req.body.listing) : null;
    var description = (req.body.description) ? req.body.description.trim() : '';

    var user = authentication.getUserFromToken(req); //user who flagged listing

    //authenticate
    if (!user) {
        res.status(401).send('unauthorized');
    } else if (description === '') {
        res.status(400).send({successful: false, text: 'Please provide a brief description of this report.'});
    } else {
        new Flag({
            description: description,
            listing: listing._id,
            user: user._id

    }).save(function(err) {
            if (err) {
                res.status(500).send({successful: false, text: 'Failed to flag listing:.'});
            } else {
                res.status(200).send({successful: true, text: 'Listing has been flagged'});
            }
        });
    }
};

exports.getById = function(req, res, next) {

};
