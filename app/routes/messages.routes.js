var messages = require('../controllers/messages.controller');
var auth = require('../utils/auth-middleware.utils');

module.exports = function (app) {
    app.get('/messages/:first_user_id/:second_user_id/:listing_id',
        auth.authenticateTokenMiddleware,
        messages.findMessages
    );

    app.post('/messages',
        // auth.authenticateTokenMiddleware,
        // do something
    );
};
