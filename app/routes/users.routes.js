var users = require('../controllers/users.controller');
var admins = require('../controllers/admins.controller');
var auth = require('../utils/auth-middleware.utils');

module.exports = function (app) {
    app.post('/create-account', users.createAccount);

    app.post('/resend-verification', users.resendVerification);

    app.get('/verify/:token', users.verifyUser);

    app.post('/login', users.login);

    app.get('/authenticate', users.authenticateToken);

    app.route('/profile').get(users.getCurrentUser);

    app.post('/user/update-first-name', users.updateFirstName);

    app.post('/user/update-last-name', users.updateLastName);

    app.post('/user/update-profile-picture-url', users.updateProfilePictureUrl);

    app.post('/user/update-profile-bio', users.updateProfileBio);

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