var secret;
try {
    secret = require('../../secret.config');
} catch (err) {
    secret = require('../../secret.config.sample');
}

module.exports = {
    port: 1337,
    shouldLog: true,
    db: 'mongodb://localhost/thriftdb',
    secret: secret.secret,
    emailUsername: secret.emailUsername,
    emailPassword: secret.emailPassword
};