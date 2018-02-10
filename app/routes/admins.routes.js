var admins = require('../controllers/admins.controller');
var auth = require('../utils/auth-middleware.utils');

module.exports = function (app) {
    app.post('/admin/register',
        auth.authenticateTokenMiddleware,
        admins.isAdmin,
        admins.findUserByEmail,
        admins.doesAdminAlreadyExist,
        admins.registerAdmin);

/*
 *  The purpose of this route is to create the very first admin
 *  and then for this route to be deleted. After this route is
 *  deleted, new admins can only be registered by another admin.
 */
    app.post('/admin/temporary-register',
        auth.authenticateTokenMiddleware,
        admins.findUserByEmail,
        admins.doesAdminAlreadyExist,
        admins.registerAdmin);
};