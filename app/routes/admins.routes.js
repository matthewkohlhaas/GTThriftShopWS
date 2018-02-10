var admins = require('../controllers/admins.controller');
var users = require('../controllers/users.controller');
var auth = require('../utils/auth-middleware.utils');

module.exports = function (app) {
    app.post('/admin/register',
        auth.authenticateTokenMiddleware,
        admins.isAdminMiddleware,
        users.findUserByEmail,
        admins.doesAdminAlreadyExist,
        admins.registerAdmin);

    app.get('/isAdmin',
        auth.authenticateTokenMiddleware,
        admins.isAdmin);

/*
 *  The purpose of this route is to create the very first admin
 *  and then for this route to be deleted. After this route is
 *  deleted, new admins can only be registered by another admin.
 */
    app.post('/admin/temporary-register',
        auth.authenticateTokenMiddleware,
        users.findUserByEmail,
        admins.doesAdminAlreadyExist,
        admins.registerAdmin);
};
