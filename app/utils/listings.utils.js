var getAttribute = function(req) {
    var attribute = req.query['sort'];
    if (!attribute) {
        return null;
    }
    if (attribute == 'price') {
        return attribute;
    }
    return null;
};

var getDirection = function(req) {
    if (req.query['direction'] === 'descending') {
        return 'descending';
    }
    return 'ascending';
};

exports.addSortToQuery = function (query, req) {
    var attribute = getAttribute(req);
    if (!attribute) {
        return;
    }
    var direction = getDirection(req);
    var sort_param = [attribute, direction];
    query.sort([sort_param]);
};
