var ticket = require('../controllers/ticket.controller');

module.exports = function(app) {
    app.post('/tickets', ticket.createTicket);
};