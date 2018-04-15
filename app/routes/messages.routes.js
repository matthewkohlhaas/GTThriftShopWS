var messages = require('../controllers/messages.controller');
var auth = require('../utils/auth-middleware.utils');

module.exports = function (app) {

    app.get('/messages/:listing_id/users/:first_user_id/:second_user_id',
        auth.authenticateToken,
        messages.verifyUser,
        messages.findMessages
    );

    app.post('/messages',
        auth.authenticateToken,
        messages.validateListing,
        messages.setSendingUser,
        messages.validateReceiver,
        messages.validateMessage,
        messages.verifyListingOwner,
        messages.createMessage
    );
};
