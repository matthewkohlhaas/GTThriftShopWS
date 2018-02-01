var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var config = require('../../config/config');
var AuthUtils = require('../utils/authentication.utils');
var User = require('../models/user.model');
var VerificationToken = require('../models/verification-token.model');

const EMAIL_REGEX = new RegExp('^(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08'
    + '\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@gatech.edu$');
const MIN_PASSWORD_LENGTH = 8;
const TOKEN_EXPIRATION_TIME = '7 days';
const TRANSPORTER = {
    service: 'gmail',
    auth: {
        user: config.emailUsername,
        pass: config.emailPassword
    }
};

const EMAIL_FROM = config.emailUsername;
const EMAIL_VERIFY_SUBJECT = 'Verify Your GT ThriftShop Account';

exports.createAccount = function (req, res) {
    var email = (req.body.email) ? req.body.email.trim() : '';
    var password = (req.body.password) ? req.body.password.trim() : '';
    var firstName = (req.body.firstName) ? req.body.firstName.trim() : '';
    var lastName = (req.body.lastName) ? req.body.lastName.trim() : '';

    if (!EMAIL_REGEX.test(email)) {
        res.status(400).send({successful: false, text: 'Please provide a valid Georgia Tech email address'});

    } else if (password.length < MIN_PASSWORD_LENGTH) {
        res.status(400).send({successful: false, text: 'Please provide a password that is at least 6 characters long.'
        });

    } else if (firstName === '') {
        res.status(400).send({successful: false, text: 'Please provide a first name.'});

    } else if (lastName === '') {
        res.status(400).send({successful: false, text: 'Please provide a last name.'});

    } else {
        var user = new User({
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName
        });
        user.save(function (err) {
            if (err) {
                res.status(400).send({successful: false, text: 'The email address, ' +  user.email
                    + ' is already associated with another account.'});
            } else {
                const failureMessage = 'Your account was created, however we could not send a verification email.';
                var token = new VerificationToken({user: user._id, token: crypto.randomBytes(16).toString('hex')});

                token.save(function (err) {
                    if (err) {
                        res.status(500).send({successful: false, text: failureMessage});
                    } else {
                        nodemailer.createTransport(TRANSPORTER).sendMail({
                            from: EMAIL_FROM,
                            to: user.email,
                            subject: EMAIL_VERIFY_SUBJECT,
                            text: 'Hello ' + user.firstName + ' ' + user.lastName + ',\n\nPlease verify your GT '
                            + 'ThriftShop account by clicking the link:\nhttp:\/\/' + req.headers.host
                            + '\/verify?token=' + token.token + '.\n'
                        }, function (err) {
                            if (err) {
                                res.status(503).send({successful: true, text: 'Your new account was created, but our '
                                    + 'email service failed to send a verification email.'});
                            } else {
                                res.json({successful: true, text: 'Check your email for a link to verify your account.'
                                });
                            }
                        });
                    }
                });
            }
        });
    }
};

exports.resendVerification = function (req, res, next) {
    var email = (req.body.email) ? req.body.email.trim() : '';

    if (!EMAIL_REGEX.test(email)) {
        res.json({successful: false, text: 'Please provide a valid Georgia Tech email address'});

    } else {
        User.findOne({email: req.body.email}, function (err, user) {
            if (err) {

            } else if (!user) {
                res.status(400).send({successful: false, text: 'We were unable to find an account associated with that '
                    + 'email address.' });
            } else if (user.isVerified) {
                res.status(400).send({successful: false, text: 'The account associated with that email address has '
                    + 'already been verified.'});
            } else {
                var token = new VerificationToken({user: user._id, token: crypto.randomBytes(16).toString('hex')});

                token.save(function (err) {
                    if (err) {
                        res.status(500).send({successful: false, text: err.message});
                    } else {
                        nodemailer.createTransport(TRANSPORTER).sendMail({
                            from: EMAIL_FROM,
                            to: user.email,
                            subject: EMAIL_VERIFY_SUBJECT,
                            text: 'Hello ' + user.firstName + ' ' + user.lastName + ',\n\nPlease verify your GT '
                            + 'ThriftShop account by clicking the link:\nhttp:\/\/' + req.headers.host
                            + '\/verify?token=' + token.token + '.\n'
                        }, function (err) {
                            if (err) {
                                res.status(503).send({successful: false, text: 'Our email service failed to send a '
                                    + 'verification email.'});
                            } else {
                                res.json({successful: true, text: 'Check your email for a link to verify your account.'
                                });
                            }
                        });
                    }
                });
            }
        });
    }
};

exports.verifyUser = function (req, res, next) {
    VerificationToken.findOne({token: req.query.token}, function (err, token) {
        if (err) {
            res.status(500).send({successful: false, text: err.message});
        } else if (!token) {
            res.status(400).send({successful: false, text: 'We were unable to verify your account. This verification '
                + 'link my have expired.' })
        } else {
            User.findOne({_id: token.user}, function (err, user) {
                if (err) {
                    res.status(500).send({successful: false, text: err.message});
                } else if (!user) {
                    res.status(400).send({successful: false, text: 'We were unable to find an account associated with '
                        + 'this verification link.' })
                } else if (user.isVerified) {
                    res.status(400).send({successful: false, text: 'Your account has already been verified.'})
                } else {
                    user.isVerified = true;
                    user.save(function (err) {
                        if (err) {
                            res.status(500).send({successful: false, text: err.message});
                        } else {
                            res.send('Your account has been successfully verified! You may now log in.');
                        }
                    });
                }
            })
        }
    })
};

exports.login = function (req, res) {
    var failureMsg = 'The email or password you provided was incorrect.';

    User.findOne({email: req.body.email})
        .select('+password')
        .exec(function (err, user) {
            if (err) {
                res.status(500).send({successful: false, text: err.message});

            } else if (!user) {
                res.status(401).send({successful: false, text: failureMsg});

            } else {
                user.comparePassword(req.body.password, function (err, isMatch) {
                    if (err) {
                        res.status(500).send({successful: false, text: err.message});

                    } else if (!isMatch) {
                        res.status(401).send({successful: false, text: failureMsg});

                    } else if (!user.isVerified) {
                        res.status(401).send({successful: false, text: 'Your account has not yet been verified.'});

                    } else {
                        var payload = user.toObject();
                        delete payload.password;
                        var token = jwt.sign(payload, config.secret, {expiresIn: TOKEN_EXPIRATION_TIME});
                        res.json({successful: true, text: 'Successfully logged in as ' + user.firstName + ' '
                            + user.lastName + '.', token: token});
                    }
                });
            }
        });
};

exports.authenticateToken = function (req, res) {
    var authenticated = AuthUtils.authenticateToken(req);
    var statusCode = 401;
    if (authenticated) {
        statusCode = 200;
    }
    res.status(statusCode).send(authenticated);
};