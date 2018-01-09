var users = require('../controllers/users.controller');

module.exports = function(app) {
    app.route('/users').post(users.create).get(users.list);

    app.route('/users/:userId').get(users.read);

    app.param('userId', users.userByID);
};