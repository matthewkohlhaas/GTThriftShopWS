var authentication = require('../utils/authentication.utils');
var Message = require('../models/message.model');
var User = require('../models/user.model');

exports.findMessages = function (req, res) {
    var query = Message.find({
        $and: [
            {listing: req.listing_id},
            {$or: [{sendingUser: req.first_user_id}, {sendingUser: req.second_user_id}]},
            {$or: [{receivingUser: req.first_user_id}, {receivingUser: req.second_user_id}]}
        ]
    });
    query.populate('sendingUser').populate('receivingUser').populate('listing');
    query.sort(['createdAt', 'ascending']);
    query.exec(function (err, messages) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).send(messages)
        }
    });
};
