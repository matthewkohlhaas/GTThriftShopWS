var verification = require('../utils/verification.util');
var Ticket = require('mongoose').model('Ticket');

exports.createTicket = function(req, res, next) {
    var subject = (req.body.subject) ? req.body.subject.trim() : '';
    var message = (req.body.message) ? req.body.message.trim() : '';
    var email = (req.body.email) ? req.body.email.trim() : '';


    //TODO: authenticate


    if (subject === '') {
        res.status(400).send({successful: false, text: 'Please provide a meaningful subject for the ticket.'});
    } else if (message === '') {
        res.status(400).send({successful: false, text: 'Please provide a descriptive message for your question.'});
    } else if (message === '') {
        res.status(400).send({successful: false, text: 'Please provide a valid email address.'});

    } else {
        var ticket = new Ticket({
            subject: subject,
            message: message,
            email: email
        });
        ticket.save(function(err) {
            if (err) {
                res.status(500).send({successful: false, text: 'ticket was NOT submitted'});
            }
            res.status(200).send({successful: true, text: 'ticket ' + ticket.id + ' was submitted', ref: ticket.id});
        });
    }
};