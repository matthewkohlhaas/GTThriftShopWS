var ticket = require('../controllers/ticket.controller');

module.exports = function(app) {
    app.post('/create-ticket', ticket.createTicket);
};