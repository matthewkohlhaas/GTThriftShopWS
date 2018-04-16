const Question = require('../models/question.model');

exports.putAnswer = function (req, res, next) {
    if (!req.body.answer) {
        res.status(400).send({successful: false, text: 'Please provide an answer'});
    } else {
        Question.findById(req.params.id).populate('listing').exec(function (err, question) {
            if (err) {
                res.status(500).send({successful: false, text: err.message});

            } else if (!question) {
                res.status(400).send({successful: false, text: 'Cannot find offer :/'});

            } else if (req.body.user._id !== question.listing.user.toString()) {
                res.status(403).send({successful: false, text: 'You cannot answer a question about a listing that is '
                    + 'not yours.'});
            } else {
                question.answer = req.body.answer;
                question.save(function (err) {
                    if (err) {
                        res.status(500).send({successful: false, text: 'Failed to answer question.'});
                    } else {
                        res.status(200).send({successful: true, text: 'Successfully answered question.'});
                    }
                });
            }
        });
    }
};
