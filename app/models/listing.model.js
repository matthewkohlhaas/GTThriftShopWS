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
    },
    offers: [{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Offer'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

ListingSchema.virtual('userRating').get(function() {
    if (this.user.totalRatings > 0) {
        return this.user.positiveRatings / this.user.totalRatings * 100;
    }
    return null;
});

ListingSchema.set('toObject', { virtuals: true });
ListingSchema.set('toJSON', { virtuals: true });

ListingSchema.index({name: 'text', description: 'text'});

module.exports = mongoose.model('Listing', ListingSchema);
