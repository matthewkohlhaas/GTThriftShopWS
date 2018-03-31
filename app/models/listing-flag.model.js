var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ListingFlagSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    flaggedListing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: false
    },
    reason: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('ListingFlag', ListingFlagSchema);
