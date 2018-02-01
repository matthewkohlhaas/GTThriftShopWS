var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TicketSchema = new Schema({
    subject: String,
    message: String,
});

module.exports = mongoose.model('Ticket', TicketSchema);