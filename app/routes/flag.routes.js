var flag = require('../controllers/flag.controller');

module.exports = function(app) {
    app.post('/flags/listing-flags', flag.flagListing);
};
