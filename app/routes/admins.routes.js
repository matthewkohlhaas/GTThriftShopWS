var admins = require('../controllers/admins.controller');
var users = require('../controllers/users.controller');
var auth = require('../utils/auth-middleware.utils');

module.exports = function (app) {
    app.post('/admins',
        auth.authenticateToken,
        admins.isAdminMiddleware,
        users.findUserByEmail,
        admins.doesAdminAlreadyExist,
        admins.registerAdmin);

    app.get('/admins/is-admin',
        auth.authenticateToken,
        admins.isAdmin);

/*
 *  The purpose of this route is to create the very first admin
 *  and then for this route to be deleted. After this route is
 *  deleted, new admins can only be registered by another admin.
 */
    app.post('/admins/temp',
        auth.authenticateToken,
        users.findUserByEmail,
        admins.doesAdminAlreadyExist,
        admins.registerAdmin);
};
