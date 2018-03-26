var authentication = require('../utils/authentication.utils');
var Message = require('../models/message.model');
var User = require('../models/user.model');
var Listing = require('../models/listing.model');


exports.findMessages = function (req, res) {
    var query = Message.find({
        $and: [
            {listing: req.listing_id},
            {$or: [{sendingUser: req.first_user_id}, {sendingUser: req.second_user_id}]},
            {$or: [{receivingUser: req.first_user_id}, {receivingUser: req.second_user_id}]}
        ]
    });
    query.populate('sendingUser').populate('receivingUser').populate('listing');
    query.sort([['createdAt', 'ascending']]);
    query.exec(function (err, messages) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).send(messages)
        }
    });
};

exports.validateListing = function (req, res, next) {
    Listing.findOne({listing: req.listing}, function(err, listing) {
        if (err) {
            return res.status(500).send(err.message);
        }
        else if (!listing) {
            return res.status(400).send('Could not find listing.');
        }
        else {
            next();
        }
    });
};

exports.setSendingUser = function (req, res, next) {
    var user = authentication.getUserFromToken(req);
    req.sendingUser = user.id;
};

exports.validateReceiver = function (req, res, next) {
    User.findOne({user: req.receivingUser}, function(err, user) {
        if (err) {
            return res.status(500).send(err.message);
        }
        else if (!user) {
            return res.status(400).send('Could not find receiving user.');
        }
        else {
            next();
        }
    });
};

exports.validateMessage = function (req, res, next) {
    if (!req.message || req.message === '') {
        return res.status(400).send('No message.');
    }
};

exports.createMessage = function(req, res) {
    var newMessage = new Message({
        listing: req.listing,
        sendingUser: req.sendingUser,
        receivingUser: req.receivingUser,
        message: req.message
    });
    newMessage.save(function(err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200);
        }
    });
};
