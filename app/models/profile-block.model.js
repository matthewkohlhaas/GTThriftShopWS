var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProfileBlockSchema = new Schema({
    description: {
        type: String,
        required: false
    },
    blockedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
});

module.exports = mongoose.model('ProfileBlock', ProfileBlockSchema);
