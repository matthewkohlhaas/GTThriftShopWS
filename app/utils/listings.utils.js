var arrayContains = require('array-contains');

const ATTRIBUTES = ['price'];

exports.addSortToQuery = function (query, req) {
    var attribute = req.query['sort'];
    if (!attribute) {
        return;
    }
    if (!arrayContains(ATTRIBUTES, attribute)) {
        return;
    }
    var direction = 1;
    if (req.query['direction'] === 'descend') {
        direction = -1;
    }
    var sort_param = [attribute, direction];
    query.sort([sort_param]);
};
