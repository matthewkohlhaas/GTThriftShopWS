var questions = require('../controllers/questions.controller');
var auth = require('../utils/auth-middleware.utils');

module.exports = function (app) {
    app.put('/questions/:id/answer',
        auth.getUserFromToken,
        questions.putAnswer
    );
};
