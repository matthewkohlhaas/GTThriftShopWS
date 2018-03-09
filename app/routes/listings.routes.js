var listings = require('../controllers/listings.controller');
var auth = require('../utils/auth-middleware.utils');

module.exports = function (app) {
    app.route('/listings/:listing')
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

    app.route('/edit-listing')
        .post(
            auth.authenticateTokenMiddleware,
            listings.editListing
        )

};
