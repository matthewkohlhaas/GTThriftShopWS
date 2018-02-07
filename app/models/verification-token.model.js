var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

var VerificationTokenSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now, expires: 43200
    },
    token: String
});

VerificationTokenSchema.pre('save', function (next) {
    if (this.isNew) {
        this.token = crypto.randomBytes(16).toString('hex');
    }
    return next();
});

module.exports = mongoose.model('VerificationToken', VerificationTokenSchema);