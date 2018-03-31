var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserFlagSchema = new Schema({
    description: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    flaggedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('UserFlag', UserFlagSchema);
