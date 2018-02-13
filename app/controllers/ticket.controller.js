var authentication = require('../utils/authentication.utils');
var Ticket = require('mongoose').model('Ticket');
var User = require('mongoose').model('User');


exports.createTicket = function(req, res, next) {
    var subject = (req.body.subject) ? req.body.subject.trim() : '';
    var message = (req.body.message) ? req.body.message.trim() : '';

    //authenticate
    if (!authentication.authenticateToken(req)) {
        return res.status(401).send('unauthorized');
    } else if (subject === '') {
        res.status(400).send({successful: false, text: 'Please provide a meaningful subject for the ticket.'});
    } else if (message === '') {
        res.status(400).send({successful: false, text: 'Please provide a descriptive message for your question.'});
    } else {
        var user = authentication.getUserFromToken(req);
        var ticket = new Ticket({
            subject: subject,
            message: message,
            user: user._id
        });
        ticket.save(function(err) {
            if (err) {
                res.status(500).send({successful: false, text: 'ticket was NOT submitted'});
            }
            res.status(200).send({successful: true, text: 'ticket ' + ticket.id + ' was submitted', ref: ticket.id});
        });
    }
};