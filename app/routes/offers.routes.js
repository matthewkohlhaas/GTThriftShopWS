var offers = require('../controllers/offers.controller');
var auth = require('../utils/auth-middleware.utils');

module.exports = function (app) {
    app.post('/offers/:id/messages',
        auth.getUserFromToken,
        offers.postMessage
    );
};
