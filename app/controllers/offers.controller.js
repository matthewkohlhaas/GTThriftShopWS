const Offer = require('../models/offer.model');

exports.getMessages = function (req, res, next) {
    Offer.findById(req.params.id).populate('listing').exec(function (err, offer) {
        if (err) {
            res.status(500).send({successful: false, text: err.message});

        } else if (!offer) {
            res.status(400).send({successful: false, text: 'Cannot find offer :/'});

        } else if (req.body.user._id !== offer.user.toString() && req.body.user._id !== offer.listing.user.toString()) {
            res.status(403).send({successful: false, text: 'You cannot get a message to an offer you are not involved '
                + 'with.'});
        } else {
            res.status(200).json(offer.messages);
        }
    })
};

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
            offer.messages.push({author: req.body.user._id, text: req.body.text});
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

exports.putAccepted = function (req, res, next) {
    if (!req.body.accepted) {
        res.status(400).send({successful: false, text: 'Please provide an accepted status'});
    } else {
        Offer.findById(req.params.id).populate('listing').exec(function (err, offer) {
            if (err) {
                res.status(500).send({successful: false, text: err.message});

            } else if (!offer) {
                res.status(400).send({successful: false, text: 'Cannot find offer :/'});

            } else if (req.body.user._id !== offer.listing.user.toString()) {
                res.status(403).send({successful: false, text: 'You cannot modify accepted status of an offer for a '
                    + 'listing that is not yours.'});
            } else {
                offer.accepted = req.body.accepted;
                if (offer.accepted) {
                    offer.rejected = false;
                }
                offer.save(function (err) {
                    if (err) {
                        res.status(500).send({successful: false, text: 'Failed to modify accepted status.'});
                    } else {
                        res.status(200).send({successful: true, text: 'Successfully modified accepted status.'});
                    }
                });
            }
        });
    }
};

exports.putRejected = function (req, res, next) {
    if (!req.body.rejected) {
        res.status(400).send({successful: false, text: 'Please provide an rejected status'});
    } else {
        Offer.findById(req.params.id).populate('listing').exec(function (err, offer) {
            if (err) {
                res.status(500).send({successful: false, text: err.message});

            } else if (!offer) {
                res.status(400).send({successful: false, text: 'Cannot find offer :/'});

            } else if (req.body.user._id !== offer.listing.user.toString()) {
                res.status(403).send({successful: false, text: 'You cannot modify rejected status of an offer for a '
                    + 'listing that is not yours.'});
            } else {
                offer.rejected = req.body.rejected;
                if (offer.rejected) {
                    offer.accepted = false;
                }
                offer.save(function (err) {
                    if (err) {
                        res.status(500).send({successful: false, text: 'Failed to modify rejected status.'});
                    } else {
                        res.status(200).send({successful: true, text: 'Successfully modified rejected status.'});
                    }
                });
            }
        });
    }
};