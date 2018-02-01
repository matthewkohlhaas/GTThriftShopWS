var verification = require('../utils/verification.util');
var Ticket = require('mongoose').model('Ticket');

exports.createTicket = function(req, res) {
    var subject = (req.body.subject) ? req.body.subject.trim() : '';
    var message = (req.body.message) ? req.body.message.trim() : '';

    if (subject.length < 1) {
        res.json({successful: false, text: 'Please provide a meaningful subject for the ticket.'});

    } else if (message === '') {
        res.json({successful: false, text: 'Please provide a descriptive message for your question.'});

    } else {
        var ticket = new Ticket({
            subject: subject,
            message: message,
        });
        ticket.save(function(err) {
            if (err) {
                return res.json({successful: false, text: 'ticket was NOT submitted'});
            }
            res.json({successful: true, text: 'ticket ' + ticket.id + ' was submitted', ref: ticket.id});
        });
    }
};