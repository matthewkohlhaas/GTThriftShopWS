var messages = require('../controllers/messages.controller');
var auth = require('../utils/auth-middleware.utils');

module.exports = function (app) {

    app.get('/messages/users/:first_user_id',
        auth.authenticateTokenMiddleware,
        messages.verifyUser,
        messages.findAllMessagesForUser
    );

    app.get('/messages/:listingId/users/:userId',
        auth.authenticateTokenMiddleware,
        messages.findAllMessagesForListing
    );

    app.get('/messages/:listing_id/:first_user_id/:second_user_id',
        auth.authenticateTokenMiddleware,
        messages.verifyUser,
        messages.findMessages
    );

    app.post('/messages',
        auth.authenticateTokenMiddleware,
        messages.validateListing,
        messages.setSendingUser,
        messages.validateReceiver,
        messages.validateMessage,
        //messages.verifyListingOwner,
        messages.createMessage
    );
};
