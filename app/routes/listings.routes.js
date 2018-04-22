var listings = require('../controllers/listings.controller');
var auth = require('../utils/auth-middleware.utils');

module.exports = function (app) {

    app.route('/listings/current-user')
        .get(
            auth.authenticateToken,
            listings.listForCurrentUser
        );

    app.route('/listings/:id')
        .get(
            auth.authenticateToken,
            listings.getById
        ).put(
        auth.authenticateToken,
        listings.editListing
    );

    app.route(
        '/listings'
    ).get(
        auth.authenticateToken,
        listings.list,
        listings.postProcessListings
    ).post(
        auth.getUserFromToken,
        listings.createListing
    );

    app.get('/listings/users/:userId',
        auth.authenticateToken,
        listings.allListingsForUser
    );

    app.post('/listings/:id/questions',
        auth.getUserFromToken,
        listings.postQuestion
    );

    app.route(
        '/listings/:id/offers'
    ).get(
        auth.getUserFromToken,
        listings.getOffers
    ).post(
        auth.getUserFromToken,
        listings.processPrice,
        listings.postOffer
    );
};
