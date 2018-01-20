var jwt = require('jsonwebtoken');
var config = require('../../config/config');
var User = require('mongoose').model('User');

exports.createAccount = function(req, res) {
    if (!req.body.email || !req.body.password || !req.body.password || !req.body.lastName) {
        res.json({success: false, msg: 'Please provide email and password.'});
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
                return res.json({success: false, msg: 'Another account is already associated with that email address'});
            }
            res.json({success: true, msg: 'Successfully created new user account.'});
        });
    }
};

exports.login = function(req, res) {
    User.findOne({
        email: req.body.email
    }, function(err, user) {
        if (err) {
            throw err;
        } else if (!user) {
            res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var token = jwt.sign(user.toObject(), config.secret);
                    // return the information including token as JSON
                    res.json({success: true, token: 'JWT ' + token});
                } else {
                    res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });
};