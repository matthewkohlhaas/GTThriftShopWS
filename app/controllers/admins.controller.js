var Admin = require('../models/admin.model');
var User = require('../models/user.model');
var AuthUtils = require('../utils/authentication.utils');

exports.isAdminMiddleware = function (req, res, next) {
    var user = AuthUtils.getUserFromToken(req);
    Admin.findOne({ 'user': user }, function (err, admin) {
        if (err || !admin) {
            return res.status(403).send('forbidden');
        }
        next();
    });
};

exports.isAdmin = function (req, res, next) {
    var user = AuthUtils.getUserFromToken(req);
    Admin.findOne({ 'user': user }, function (err, admin) {
        if (err || !admin) {
            return res.status(200).send(false);
        } else {
            return res.status(200).send(true);
        }
    });
};

exports.doesAdminAlreadyExist = function (req, res, next) {
    Admin.findOne({ 'user': req.found_user }, function (err, found) {
        if (found) {
            return res.status(422).send('User is already an admin.');
        }
        if (err) {
            return res.status(500).send('Failed to register user as admin.');
        }
        next();
    });
};

exports.registerAdmin = function (req, res, next) {
    var admin = new Admin({
        user: req.found_user
    });
    admin.save(function (err) {
        if (err) {
            return res.status(500).send('Failed to register user as admin.');
        } else {
            return res.status(201).send({text: 'User succesfully registered as admin.'});
        }
    });
};
