var listings = require('../controllers/listings.controller');

module.exports = function (app) {
    app.get('/listings', listings.list);

    app.post('/create-listing', listings.createListing);

    app.route('/get-listing-by-id').get(listings.getById);

};
