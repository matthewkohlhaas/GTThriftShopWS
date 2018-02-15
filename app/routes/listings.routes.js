var listings = require('../controllers/listings.controller');

module.exports = function (app) {
    app.route('/listings').get(listings.list);
    app.post('/create-listing', listings.createListing);
    app.route('/get-listing-by-id').get(listings.getById);
};
