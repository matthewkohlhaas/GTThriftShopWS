var secret;
try {
    secret = require('../../secret.config');
} catch (err) {
    secret = require('../../secret.config.sample');
}

module.exports = {
    port: 7357,
    shouldLog: false,
    db: 'mongodb://localhost/thriftdb-test',
    secret: secret.secret,
    emailUsername: secret.emailUsername,
    emailPassword: secret.emailPassword
};