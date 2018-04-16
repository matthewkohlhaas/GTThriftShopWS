var offers = require('../controllers/offers.controller');
var auth = require('../utils/auth-middleware.utils');

module.exports = function (app) {
    app.route(
        '/offers/:id/messages'
    ).get(
        auth.getUserFromToken,
        offers.getMessages
    ).post(
        auth.getUserFromToken,
        offers.postMessage
    );

    app.put('/offers/:id/accepted',
        auth.getUserFromToken,
        offers.putAccepted
    );

    app.put('/offers/:id/rejected',
        auth.getUserFromToken,
        offers.putRejected
    );
};
