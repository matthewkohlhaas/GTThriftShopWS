var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true
    },
    positiveRatings: Number,
    totalRatings: Number
});

mongoose.model('User', UserSchema);