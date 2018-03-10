var jwt = require('jsonwebtoken');
var config = require('../../config/config');
var User = require('../models/user.model');
var VerificationToken = require('../models/verification-token.model');
var PasswordResetToken = require('../models/password-reset-token.model');
var AuthUtils = require('../utils/authentication.utils');
var EmailUtils = require('../utils/email.utils');

const MIN_PASSWORD_LENGTH = 8;
const TOKEN_EXPIRATION_TIME = '7 days';

exports.createAccount = function (req, res) {
    var email = (req.body.email) ? req.body.email.trim().toLowerCase() : '';
    var password = (req.body.password) ? req.body.password.trim() : '';
    var firstName = (req.body.firstName) ? req.body.firstName.trim() : '';
    var lastName = (req.body.lastName) ? req.body.lastName.trim() : '';
    var profileBio = (req.body.profileBio) ? req.body.profileBio.trim() : '';
    var profilePictureUrl = (req.body.profilePictureUrl) ? req.body.profilePictureUrl.trim() : '';

    if (!EmailUtils.validateEmail(email)) {
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
            lastName: lastName,
            profileBio: profileBio,
            profilePictureUrl: profilePictureUrl
        });
        user.save(function (err) {
            if (err) {
                res.status(400).send({successful: false, text: 'The email address, ' +  user.email
                    + ' is already associated with another account.'});
            } else {
                const errorMessage = 'Your account was created, however we could not send a verification email.';

                var token = new VerificationToken({user: user._id});

                token.save(function (err) {
                    if (err) {
                        res.status(500).send({successful: true, text: errorMessage});
                    } else {
                        sendVerificationEmail(user, token, errorMessage, true, res);
                    }
                });
            }
        });
    }
};

exports.resendVerificationEmail = function (req, res, next) {
    var email = (req.body.email) ? req.body.email.trim().toLowerCase() : '';

    if (!EmailUtils.validateEmail(email)) {
        res.status(400).send({successful: false, text: 'Please provide a valid Georgia Tech email address'});

    } else {
        User.findOne({email: email}, function (err, user) {
            if (err) {

            } else if (!user) {
                res.status(400).send({successful: false, text: 'We were unable to find an account associated with that '
                    + 'email address.' });
            } else if (user.isVerified) {
                res.status(400).send({successful: false, text: 'The account associated with that email address has '
                    + 'already been verified.'});
            } else {
                var token = new VerificationToken({user: user._id});

                token.save(function (err) {
                    if (err) {
                        res.status(500).send({successful: false, text: err.message});
                    } else {
                        const errorMessage = 'Our email service failed to send a verification email.';

                        sendVerificationEmail(user, token, errorMessage, false, res);
                    }
                });
            }
        });
    }
};

function sendVerificationEmail(user, token, errorMessage, successfulOnErr, res) {
    const emailSubject = 'Verify Your GT ThriftShop Account';

    const emailText = 'Hello ' + user.firstName + ' ' + user.lastName + ',\n\nPlease verify your GT ThriftShop account '
        + 'by clicking the link:\nhttp:\/\/' + config.uiUrl + '\/verify/' + token.token;

    const successMessage = 'Check your email for a link to verify your account.';

    EmailUtils.sendEmail(user.email, emailSubject, emailText, function () {
        res.status(200).send({successful: true, text: successMessage});
    }, function (err) {
        res.status(503).send({successful: successfulOnErr, text: errorMessage});
    });
}

exports.verifyUser = function (req, res, next) {
    VerificationToken.findOne({token: req.params.token}, function (err, token) {
        if (err) {
            res.status(500).send({successful: false, text: err.message});
        } else if (!token) {
            res.status(400).send({successful: false, text: 'We were unable to verify your account. This verification '
                + 'link my have expired.'})
        } else {
            User.findOne({_id: token.user}, function (err, user) {
                if (err) {
                    res.status(500).send({successful: false, text: err.message});
                } else if (!user) {
                    res.status(400).send({successful: false, text: 'We were unable to find an account associated with '
                        + 'this verification link.'})
                } else if (user.isVerified) {
                    res.status(400).send({successful: false, text: 'Your account has already been verified.'})
                } else {
                    user.isVerified = true;
                    user.save(function (err) {
                        if (err) {
                            res.status(500).send({successful: false, text: err.message});
                        } else {
                            res.status(200).send({successful: true, text: 'Your account has been successfully verified!'
                                + ' You may now log in.'});
                        }
                    });
                }
            })
        }
    })
};

exports.sendPasswordResetEmail = function (req, res, next) {
    var email = (req.body.email) ? req.body.email.trim().toLowerCase() : '';

    if (!EmailUtils.validateEmail(email)) {
        res.status(400).send({successful: false, text: 'Please provide a valid Georgia Tech email address'});

    } else {
        User.findOne({email: email}, function (err, user) {
            if (err) {
                res.status(500).send({successful: false, text: err.message});
            } else if (!user) {
                res.status(400).send({successful: false, text: 'We were unable to find an account associated with that '
                    + 'email address.' });
            } else {
                var token = new PasswordResetToken({user: user._id});

                token.save(function (err) {
                    if (err) {
                        res.status(500).send({successful: false, text: err.message});
                    } else {

                        const emailSubject = 'Reset Your GT ThriftShop Password';

                        const emailText = 'Hello ' + user.firstName + ' ' + user.lastName + ',\n\nYou can reset your '
                            + 'GT ThriftShop password at the following link:\nhttp:\/\/' + config.uiUrl
                            + '\/reset-password/' + token.token;

                        EmailUtils.sendEmail(user.email, emailSubject, emailText, function () {
                            res.status(200).send({successful: true, text: 'Check your email for a link to reset '
                                + 'your password.'});
                        }, function (err) {
                            res.status(503).send({successful: false, text: 'Our email service failed to send a '
                                + 'password reset email.'});
                        });
                    }
                });
            }
        });
    }
};

exports.resetPassword = function (req, res, next) {
    var password = (req.body.password) ? req.body.password.trim().toLowerCase() : '';

    if (password.length < MIN_PASSWORD_LENGTH) {
        res.status(400).send({successful: false, text: 'Please provide a password that is at least 6 characters long.'
        });
    } else {
        PasswordResetToken.findOne({token: req.body.token}, function (err, token) {
            if (err) {
                res.status(500).send({successful: false, text: err.message});
            } else if (!token) {
                res.status(400).send({successful: false, text: 'We are unable to reset your password. This password '
                    + 'reset link may have expired.'})
            } else {
                User.findOne({_id: token.user}, function (err, user) {
                    if (err) {
                        res.status(500).send({successful: false, text: err.message});
                    } else if (!user) {
                        res.status(400).send({successful: false, text: 'We were unable to find an account associated '
                            + 'with this password reset link.'})
                    } else {
                        user.password = password;
                        user.isVerified = true; // user is verified since they used their email to reset their password
                        user.save(function (err) {
                            if (err) {
                                res.status(500).send({successful: false, text: err.message});
                            } else {
                                PasswordResetToken.remove({token: token.token}, function (err) {
                                    if (err) {
                                        res.status(500).send({successful: false, text: err.message});
                                    } else {
                                        res.status(200).send({successful: true, text: 'Your password has been '
                                            + 'successfully changed! You may now log in with your new password.'});
                                    }
                                });
                            }
                        });
                    }
                })
            }
        })
    }
};

exports.login = function (req, res) {
    var failureMsg = 'The email or password you provided was incorrect.';

    var email = (req.body.email) ? req.body.email.trim().toLowerCase() : '';

    User.findOne({email: email})
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
                        res.status(200).send({successful: true, text: 'Successfully logged in as ' + user.firstName
                            + ' ' + user.lastName + '.', token: token});
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

exports.findUserByEmail = function (req, res, next) {
    User.findOne({ 'email': req.body.email }, function (err, user) {
        if (err) {
            return res.status(500).send(err.message);
        } else if (!user) {
            return res.status(400).send('Could not find user with given email.');
        }
        req.found_user = user;
        next();
    });
};

function updateUserBan (user, isBanned, error_message, next) {
    user.isBanned = isBanned;
    user.save(function (err) {
        if (err) {
            return res.status(500).send(error_message);
        } else {
            next();
        }
    });
};

exports.banUser = function (req, res, next) {
    updateUserBan(req.found_user, true, 'Failed to ban user.', next);
};

exports.unbanUser = function (req, res, next) {
    updateUserBan(req.found_user, false, 'Failed to unban user.', next);
};

function emailUserAboutBan (email_address, subject, text, errorMessage, successMessage, res) {
    EmailUtils.sendEmail(email_address, subject, text, function () {
        return res.status(200).send({text: successMessage});
    }, function (err) {
        return res.status(503).send(errorMessage);
    });
}

exports.emailBannedUser = function (req, res) {
    var email_address = req.found_user.email;
    var subject = 'GT ThriftShop Account Banned';
    var text = req.found_user.firstName + ' ' + req.found_user.lastName + ',\n\nYour GT ThriftShop account has been '
        + 'banned by the GT Thriftshop administrators. You are no longer able to create listings or contact other '
        + 'users about their listings.\n\nGT ThriftShop Admin Team';
    var error_message = 'Failed to send email to banned user.';
    var success_message = 'User successfully banned.';
    emailUserAboutBan(email_address, subject, text, error_message, success_message, res);
};

exports.emailUnbannedUser = function (req, res) {
    var email_address = req.found_user.email;
    var subject = 'GT ThriftShop Account Unbanned';
    var text = req.found_user.firstName + ' ' + req.found_user.lastName + ',\n\nYour GT ThriftShop account has been '
        + 'unbanned by the GT Thriftshop administrators. You are now able to create listings and contact other users '
        + 'about their listings.\n\nGT ThriftShop Admin Team';
    var error_message = 'Failed to send email to unbanned user.';
    var success_message = 'User successfully unbanned.';
    emailUserAboutBan(email_address, subject, text, error_message, success_message, res);
};

exports.isUserBanned = function (req, res, next) {
    var user = AuthUtils.getUserFromToken(req);
    User.findById(user._id, function (err, user) {
        if (err) {
            return res.status(500).send(err.message);
        } else if (!user) {
            return res.status(400).send('Could not find user.');
        } else if (user.isBanned === true) {
            return res.status(403).send('forbidden');
        } else {
            next();
        }
    });
};

exports.getUserFromId = function (req, res, next) {
    User.findOne({_id: req.params.id}, function (err, user) {
        if (err) {
            res.status(500).send(err.message);
        } else if (!user) {
            res.status(400).send('Could not find user with given id.');
        } else {
            res.status(200).json(user);
        }
    });
};

exports.getUserFromToken = function (req, res) {
    var user = AuthUtils.getUserFromToken(req);
    if (!user) {
        res.status(401).send('unauthorized');
    } else {
        User.findById(user._id, function (err, user) {
            if (err) {
                res.status(500).send(err.message);
            } else if (!user) {
                res.status(400).send('Could not find user.');
            } else {
                res.status(200).json(user);
            }
        });
    }
};

exports.updateFirstName = function (req, res) {
    var firstName = (req.body.firstName) ? req.body.firstName.trim() : '';
    var user = AuthUtils.getUserFromToken(req);
    if (!user) {
        res.status(401).send('unauthorized');
    } else {
        User.findById(user._id, function(err, user) {
            if (err) {
                res.status(500).send({successful: false, text: err.message});
            } else if (!user) {
                res.status(400).send({successful: false, text: 'Could not find user.'})
            } else {
                user.firstName = firstName;
                user.save(function(err) {
                    if (err) {
                        res.status(500).send({successful: false, text: err.message});
                    } else {
                        res.status(200).send({successful: true, text: 'Your first name has been '
                            + 'successfully changed to ' + firstName + ' !'});
                    }
                });
            }
        });
    }
};

exports.updateLastName = function (req, res) {
    var lastName = (req.body.lastName) ? req.body.lastName.trim() : '';
    var user = AuthUtils.getUserFromToken(req);
    if (!user) {
        res.status(401).send('unauthorized');
    } else {
        User.findById(user._id, function(err, user) {
            if (err) {
                res.status(500).send({successful: false, text: err.message});
            } else if (!user) {
                res.status(400).send({successful: false, text: 'Could not find user.'})
            } else {
                user.lastName = lastName;
                user.save(function(err) {
                    if (err) {
                        res.status(500).send({successful: false, text: err.message});
                    } else {
                        res.status(200).send({successful: true, text: 'Your last name has been '
                            + 'successfully changed to ' + lastName + '!'});
                    }
                });
            }
        });
    }
};

exports.updateProfilePictureUrl = function (req, res) {
    var profilePictureUrl = (req.body.profilePictureUrl) ? req.body.profilePictureUrl.trim() : '';
    var user = AuthUtils.getUserFromToken(req);
    if (!user) {
        res.status(401).send('unauthorized');
    } else {
        User.findById(user._id, function(err, user) {
            if (err) {
                res.status(500).send({successful: false, text: err.message});
            } else if (!user) {
                res.status(400).send({successful: false, text: 'Could not find user.'})
            } else {
                user.profilePictureUrl = profilePictureUrl;
                user.save(function(err) {
                    if (err) {
                        res.status(500).send({successful: false, text: err.message});
                    } else {
                        res.status(200).send({successful: true, text: 'Your profile picture has been '
                            + 'successfully changed!'});
                    }
                });
            }
        });
    }
};

exports.updateProfileBio = function (req, res) {
    var profileBio = (req.body.profileBio) ? req.body.profileBio.trim() : '';
    var user = AuthUtils.getUserFromToken(req);
    if (!user) {
        res.status(401).send('unauthorized');
    } else {
        User.findById(user._id, function(err, user) {
            if (err) {
                res.status(500).send({successful: false, text: err.message});
            } else if (!user) {
                res.status(400).send({successful: false, text: 'Could not find user.'})
            } else {
                user.profileBio = profileBio;
                user.save(function(err) {
                    if (err) {
                        res.status(500).send({successful: false, text: err.message});
                    } else {
                        res.status(200).send({successful: true, text: 'Your profile bio has been '
                            + 'successfully changed!'});
                    }
                });
            }
        });
    }
};

