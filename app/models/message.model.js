var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
    sendingUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receivingUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing'
    },
    message: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Message', MessageSchema);