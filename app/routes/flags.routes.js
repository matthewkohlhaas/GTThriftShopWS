var flag = require('../controllers/flags.controller');

module.exports = function(app) {
    app.post('/flags/listing-flags', flag.flagListing);

    app.post('/flags/user-flags', flag.flagUser);
};
