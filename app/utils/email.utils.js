var config = require('../../config/config');
var nodemailer = require('nodemailer');

const EMAIL_FROM = config.emailUsername;
const EMAIL_PASSWORD = config.emailPassword;
const TRANSPORTER = {
    service: 'gmail',
    auth: {
        user: EMAIL_FROM,
        pass: EMAIL_PASSWORD
    }
};

const EMAIL_REGEX = new RegExp('^(?:[a-zA-Z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:['
    + '\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@gatech.edu$');

exports.validateEmail = function (email) {
    return EMAIL_REGEX.test(email);
};

exports.sendEmail = function (emailToAddress, emailSubject, emailText, next, error) {

    nodemailer.createTransport(TRANSPORTER).sendMail({
        from: EMAIL_FROM,
        to: emailToAddress,
        subject: emailSubject,
        text: emailText
    }, function (err) {
        if (err) {
            if (error) {
                error(err);
            } else {
                next(err);
            }
        } else {
            next();
        }
    });
};