var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FlagSchema = new Schema({
    description: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: false,
    },
});

module.exports = mongoose.model('Flag', FlagSchema);