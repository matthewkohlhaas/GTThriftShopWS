var flag = require('../controllers/flags.controller');

module.exports = function(app) {
    app.post('/flags/listing-flags', flag.flagListing);
};
