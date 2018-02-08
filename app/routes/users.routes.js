var users = require('../controllers/users.controller');

module.exports = function (app) {
    app.post('/create-account', users.createAccount);

    app.post('/resend-verification', users.resendVerification);

    app.get('/verify/:token', users.verifyUser);

    app.post('/login', users.login);

    app.get('/authenticate', users.authenticateToken);
};