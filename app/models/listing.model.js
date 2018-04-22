var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const CATEGORIES = ['cars', 'housing', 'electronics', 'appliances', 'clothing', 'furniture', 'school',
                    'services', 'miscellaneous', 'sports-outdoors', 'home', 'books'];

var ListingSchema = new Schema({
    name: String,
    description: String,
    price: Number,
    imageUrl: String,
    category: {
        type: String,
        enum: CATEGORIES,
        default: 'miscellaneous'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isOpen: {
        type: Boolean,
        default: true,
        mandatory: true
    },
    questions: [{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }],
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
