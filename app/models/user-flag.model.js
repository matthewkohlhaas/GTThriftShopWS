var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserFlagSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    flaggedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reason: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('UserFlag', UserFlagSchema);
