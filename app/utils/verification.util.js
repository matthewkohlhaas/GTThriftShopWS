exports.getToken = function(req) {
    if (req.headers && req.headers.authorization) {
        var parted = req.headers.authorization.split(' ');
        if (parted.length === 2) {
            console.log(parted[1]);
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};