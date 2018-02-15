var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    profilePictureUrl: {
        type: String,
        required: false
    },
    profileBio: {
        type: String,
        required: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    positiveRatings: {
        type: Number,
        default: 0
    },
    isBanned: {
        type: Boolean,
        default: false
    }
});

UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function (password, done) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        if (err) {
            return done(err);
        }
        done(null, isMatch);
    });
};


module.exports = mongoose.model('User', UserSchema);