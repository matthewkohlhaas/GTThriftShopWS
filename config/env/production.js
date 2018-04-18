var secret= require('../../secret.config');

module.exports = {
    port: 1337,
    shouldLog: false,
    db: '',
    uiUrl: '',
    secret: secret.secret,
    emailUsername: secret.emailUsername,
    emailPassword: secret.emailPassword
};