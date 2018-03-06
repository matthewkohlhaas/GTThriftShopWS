var flag = require('../controllers/flag.controller');

module.exports = function(app) {
    app.post('/flag-listing', flag.flagListing);
};