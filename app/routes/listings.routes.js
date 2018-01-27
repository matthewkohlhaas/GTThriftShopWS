var listings = require('../controllers/listings.controller');

module.exports = function(app) {
    app.route('/listings').get(listings.list);
};