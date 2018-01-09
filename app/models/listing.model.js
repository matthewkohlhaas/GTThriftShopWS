var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ListingSchema = new Schema({
    name: String,
    description: String,
    price: Number,
    imageUrl: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Listing', ListingSchema);