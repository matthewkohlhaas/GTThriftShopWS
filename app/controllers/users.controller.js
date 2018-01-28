var jwt = require('jsonwebtoken');
var config = require('../../config/config');
var AuthUtils = require('../utils/authentication.utils');
var User = require('mongoose').model('User');

const EMAIL_REGEX = /^.+@gatech.edu$/i;
const MIN_PASSWORD_LENGTH = 8;
const TOKEN_EXPIRATION_TIME = '7 days';

exports.createAccount = function (req, res) {
    var email = (req.body.email) ? req.body.email.trim() : '';
    var password = (req.body.password) ? req.body.password.trim() : '';
    var firstName = (req.body.firstName) ? req.body.firstName.trim() : '';
    var lastName = (req.body.lastName) ? req.body.lastName.trim() : '';

    if (!EMAIL_REGEX.test(email)) {
        res.json({successful: false, text: 'Please provide a valid Georgia Tech email address'});

    } else if (password.length < MIN_PASSWORD_LENGTH) {
        res.json({successful: false, text: 'Please provide a password that is at least 6 characters long.'});

    } else if (firstName === '') {
        res.json({successful: false, text: 'Please provide a first name.'});

    } else if (lastName === '') {
        res.json({successful: false, text: 'Please provide a last name.'});

    } else {
        var user = new User({
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName
        });
        user.save(function (err) {
            if (err) {
                return res.json({successful: false, text: 'The email address, ' +  user.email
                + ' is already associated with another account.'});
            }
            res.json({successful: true, text: 'A new account was created for ' + user.email + '!'});
        });
    }
};

exports.login = function (req, res) {
    var failureMsg = 'The email or password you provided was incorrect.';

    User.findOne({email: req.body.email})
        .select('+password')
        .exec(function (err, user) {
            if (err) {
                throw err;
            } else if (!user) {
                res.status(401).send({successful: false, text: failureMsg});
            } else {
                user.comparePassword(req.body.password, function (err, isMatch) {
                    if (isMatch && !err) {
                        var payload = user.toObject();
                        delete payload.password;
                        var token = jwt.sign(payload, config.secret, {expiresIn: TOKEN_EXPIRATION_TIME});
                        res.json({successful: true, text: 'Successfully logged in as ' + user.firstName + ' '
                        + user.lastName + '.', token: token});
                    } else {
                        res.status(401).send({successful: false, text: failureMsg});
                    }
                });
            }
        });
};

exports.authenticateToken = function (req, res) {
    var verified = AuthUtils.authenticateToken(req);
    var statusCode = 401;
    if (verified) {
        statusCode = 200;
    }
    res.status(statusCode).send(verified);
};