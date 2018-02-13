var users = require('../controllers/users.controller');
var admins = require('../controllers/admins.controller');
var auth = require('../utils/auth-middleware.utils');

module.exports = function (app) {
    app.post('/create-account', users.createAccount);

    app.post('/resend-verification', users.resendVerificationEmail);

    app.get('/verify/:token', users.verifyUser);

    app.post('/send-password-reset', users.sendPasswordResetEmail);

    app.post('/reset-password', users.resetPassword);

    app.post('/login', users.login);

    app.get('/authenticate', users.authenticateToken);

    app.post('/user/ban',
        auth.authenticateTokenMiddleware,
        admins.isAdminMiddleware,
        users.findUserByEmail,
        users.banUser,
        users.emailBannedUser);

    app.post('/user/unban',
        auth.authenticateTokenMiddleware,
        admins.isAdminMiddleware,
        users.findUserByEmail,
        users.unbanUser,
        users.emailUnbannedUser);
};