var listings = require('../controllers/listings.controller');
var auth = require('../utils/auth-middleware.utils');

module.exports = function (app) {
    app.route('/listings/:id')
        .get(
            auth.authenticateTokenMiddleware,
            listings.getById
        );

    app.route('/listings')
        .get(
            auth.authenticateTokenMiddleware,
            listings.list
        ).post(
            listings.createListing
        );

    app.route('/listing/edit')
        .post(
            auth.authenticateTokenMiddleware,
            listings.editListing
        )

};
