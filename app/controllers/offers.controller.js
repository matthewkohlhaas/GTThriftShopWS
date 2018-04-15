const Offer = require('../models/offer.model');

exports.postMessage = function (req, res, next) {
    Offer.findById(req.params.id).populate('listing').exec(function (err, offer) {
        if (err) {
            res.status(500).send({successful: false, text: err.message});

        } else if (!offer) {
            res.status(400).send({successful: false, text: 'Cannot find offer :/'});

        } else if (req.body.user._id !== offer.user.toString() && req.body.user._id !== offer.listing.user.toString()) {
            res.status(403).send({successful: false, text: 'You cannot post a message to an offer you are not involved '
                + 'with.'});

        } else {
            console.log(req.body.user._id + ' ' + offer.user.toString());
            offer.save(function(err) {
                if (err) {
                    res.status(500).send({successful: false, text: 'Failed to post message.'});
                } else {
                    res.status(200).send({successful: true, text: 'Successfully posted message.'});
                }
            });
        }
    });
};