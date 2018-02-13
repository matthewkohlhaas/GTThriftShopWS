var authentication = require('../utils/authentication.utils');
var Ticket = require('mongoose').model('Ticket');
var User = require('mongoose').model('User');


exports.createTicket = function(req, res, next) {
    var subject = (req.body.subject) ? req.body.subject.trim() : '';
    var message = (req.body.message) ? req.body.message.trim() : '';

    var user = authentication.getUserFromToken(req);

    //authenticate
    if (!user) {
        res.status(401).send('unauthorized');
    } else if (subject === '') {
        res.status(400).send({successful: false, text: 'Please provide a subject.'});
    } else if (message === '') {
        res.status(400).send({successful: false, text: 'Please provide a message.'});
    } else {
        new Ticket({
            subject: subject,
            message: message,
            user: user._id
        }).save(function(err) {
            if (err) {
                res.status(500).send({successful: false, text: 'Failed to send your support message.'});
            } else {
                res.status(200).send({successful: true, text: 'Your support message was sent successfully!'});
            }
        });
    }
};