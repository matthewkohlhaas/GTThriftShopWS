var users = require('../controllers/users.controller');
var admins = require('../controllers/admins.controller');
var auth = require('../utils/auth-middleware.utils');

module.exports = function (app) {
    app.post('/users', users.createAccount);

    app.get('/users/:id',
        auth.authenticateTokenMiddleware,
        users.getUserFromId
    );

    app.get('/users/from-token', users.getUserFromToken);
  
    app.post('/user/update-first-name', users.updateFirstName);

    app.post('/user/update-last-name', users.updateLastName);

    app.post('/user/update-profile-picture-url', users.updateProfilePictureUrl);

    app.post('/user/update-profile-bio', users.updateProfileBio);

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