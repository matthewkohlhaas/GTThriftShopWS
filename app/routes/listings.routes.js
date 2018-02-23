var listings = require('../controllers/listings.controller');
var auth = require('../utils/auth-middleware.utils');

module.exports = function (app) {
    app.get('/listings',
        auth.authenticateTokenMiddleware,
        listings.list);

    app.post('/create-listing', listings.createListing);

    app.route('/get-listing-by-id').get(listings.getById);
};
