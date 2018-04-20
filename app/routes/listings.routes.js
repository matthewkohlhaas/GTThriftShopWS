var listings = require('../controllers/listings.controller');
var auth = require('../utils/auth-middleware.utils');

module.exports = function (app) {
    app.route('/listings/current-user')
        .get(
            auth.authenticateTokenMiddleware,
            listings.listForCurrentUser
        );

    app.route('/listings/:id')
        .get(
            auth.authenticateTokenMiddleware,
            listings.getById
        ).put(
        auth.authenticateTokenMiddleware,
        listings.editListing
    );

    app.route('/listings')
        .get(
            auth.authenticateTokenMiddleware,
            listings.list,
            listings.removeClosedListings,
            listings.postProcessListings
        ).post(
            listings.createListing
        );

    app.get('/listings/users/:userId',
        auth.authenticateTokenMiddleware,
        listings.allListingsForUser
    );

};
