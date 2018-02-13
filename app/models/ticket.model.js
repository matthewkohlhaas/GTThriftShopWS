var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TicketSchema = new Schema({
    subject: String,
    message: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Ticket', TicketSchema);