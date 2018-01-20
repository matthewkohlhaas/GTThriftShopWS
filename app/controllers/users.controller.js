var jwt = require('jsonwebtoken');
var config = require('../../config/config');
var verification = require('../utils/verification.util');
var User = require('mongoose').model('User');

exports.createAccount = function(req, res) {
    if (!req.body.email || !req.body.password || !req.body.password || !req.body.lastName) {
        // TODO customized messages and verification tests (regexes)
        res.json({successful: false, text: 'Please provide email and password.'});
    } else {
        var newUser = new User({
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        });
        // save the user
        newUser.save(function(err) {
            if (err) {
                return res.json({successful: false, text: 'Another account already uses that email address'});
            }
            res.json({successful: true, text: 'Successfully created a new user account.'});
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