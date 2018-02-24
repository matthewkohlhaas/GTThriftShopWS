var users = require('../controllers/users.controller');
var admins = require('../controllers/admins.controller');
var auth = require('../utils/auth-middleware.utils');

module.exports = function (app) {
    app.route('/users').post(users.createAccount);

    // TODO add a PUT at this route to update currently logged in user
    app.route('/users/from-token').get(users.getUserFromToken);

    // TODO use this route later
    // app.get('/users/:email', users.getUserByEmail);

    app.post('/users/send-verification', users.resendVerificationEmail);

    app.get('/users/verify/:token', users.verifyUser);

    app.post('/users/send-password-reset', users.sendPasswordResetEmail);

    app.post('/users/reset-password', users.resetPassword);

    app.post('/users/login', users.login);

    app.get('/users/authenticate', users.authenticateToken);

    app.post('/users/ban',
        auth.authenticateTokenMiddleware,
        admins.isAdminMiddleware,
        users.findUserByEmail,
        users.banUser,
        users.emailBannedUser);

    app.post('/users/unban',
        auth.authenticateTokenMiddleware,
        admins.isAdminMiddleware,
        users.findUserByEmail,
        users.unbanUser,
        users.emailUnbannedUser);
};