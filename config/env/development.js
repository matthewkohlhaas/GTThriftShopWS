var secret;
try {
    secret = require('../../secret.config');
} catch (err) {
    secret = { secret: 'secret', emailUsername: '', emailPassword: '' };
}

module.exports = {
    port: 1337,
    shouldLog: true,
    db: 'mongodb://localhost/thriftdb',
    uiUrl: 'localhost:4200',
    secret: secret.secret,
    emailUsername: secret.emailUsername,
    emailPassword: secret.emailPassword
};