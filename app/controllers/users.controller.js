var jwt = require('jsonwebtoken');
var config = require('../../config/config');
var verification = require('../utils/verification.util');
var User = require('mongoose').model('User');

const EMAIL_REGEX = /^.+@gatech.edu$/i;

exports.createAccount = function(req, res) {
    var email = (req.body.email) ? req.body.email.trim() : '';
    var password = (req.body.password) ? req.body.password.trim() : '';
    var firstName = (req.body.firstName) ? req.body.firstName.trim() : '';
    var lastName = (req.body.lastName) ? req.body.lastName.trim() : '';

    if (!EMAIL_REGEX.test(email)) {
        res.json({successful: false, text: 'Please provide a valid Georgia Tech email address'});

    } else if (password.length < 6) {
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
        // save the user
        user.save(function(err) {
            if (err) {
                return res.json({successful: false, text: 'The email address, ' +  user.email
                + ' is already associated with another account.'});
            }
            res.json({successful: true, text: 'A new account was created for ' + user.email + '!'});
        });
    }
};

exports.login = function(req, res) {
    var failureMsg = 'Failed to log in. Incorrect email or password';

    User.findOne({
        email: req.body.email
    }, function(err, user) {
        if (err) {
            throw err;
        } else if (!user) {
            res.status(401).send({successful: false, text: failureMsg});
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function(err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var payload = user.toObject();
                    delete payload.password;
                    var token = jwt.sign(payload, config.secret);
                    // return the information including token as JSON
                    res.json({successful: true, text: 'Successfully logged in as ' + user.firstName + ' '
                        + user.lastName + '.', token: token});
                } else {
                    res.status(401).send({successful: false, text: failureMsg});
                }
            });
        }
    });
};

exports.verifyToken = function(req, res) {
    res.send(verification.verifyToken(req));
};