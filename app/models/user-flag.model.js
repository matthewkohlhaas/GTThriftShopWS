var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserFlagSchema = new Schema({
    description: {
        type: String,
        required: false
    },
    blockedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('UserFlag', UserFlagSchema);
