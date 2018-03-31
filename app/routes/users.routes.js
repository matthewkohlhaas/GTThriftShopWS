var users = require('../controllers/users.controller');
var admins = require('../controllers/admins.controller');
var auth = require('../utils/auth-middleware.utils');

module.exports = function (app) {
    app.post('/users', users.createAccount);

    app.get('/users/from-token', users.getUserFromToken);

    app.get('/users/:id',
        auth.authenticateTokenMiddleware,
        users.getUserFromId
    );

    app.post('/users/from-token/blocked-users', users.addBlockedUser);

    app.put('/users/from-token/first-name', users.updateFirstName);

    app.put('/users/from-token/last-name', users.updateLastName);

    app.put('/users/from-token/profile-picture-url', users.updateProfilePictureUrl);

    app.put('/users/from-token/profile-bio', users.updateProfileBio);

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
        users.emailBannedUser
    );

    app.post('/users/unban',
        auth.authenticateTokenMiddleware,
        admins.isAdminMiddleware,
        users.findUserByEmail,
        users.unbanUser,
        users.emailUnbannedUser
    );
};