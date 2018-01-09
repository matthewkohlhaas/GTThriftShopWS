var listings = require('../controllers/listings.controller');

module.exports = function(app) {
    app.route('/listings').post(listings.create).get(listings.list);
};