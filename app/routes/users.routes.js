var users = require('../controllers/users.controller');

module.exports = function(app) {
    app.post('/create-account', users.createAccount);

    app.post('/login', users.login);
};