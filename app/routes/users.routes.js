var users = require('../controllers/users.controller');

module.exports = function (app) {
    app.post('/create-account', users.createAccount);

    app.post('/resend-verification', users.resendVerificationEmail);

    app.get('/verify/:token', users.verifyUser);

    app.post('/send-password-reset', users.sendPasswordResetEmail);

    app.post('/reset-password', users.resetPassword);

    app.post('/login', users.login);

    app.get('/authenticate', users.authenticateToken);
};