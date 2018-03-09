var ticket = require('../controllers/tickets.controller');

module.exports = function(app) {
    app.post('/tickets', ticket.createTicket);
};