var arrayContains = require('array-contains');
var stableSort = require("stable");

const ATTRIBUTES = ['price', 'createdAt'];

var getAttribute = function (req) {
    var attribute = req.query['sort'];
    if (arrayContains(ATTRIBUTES, attribute)) {
        return attribute;
    }
    return null;
};

var isAscending = function (req) {
    return req.query['direction'] === 'ascending';
};

var isDescending = function (req) {
    return req.query['direction'] === 'descending';
};

var getDirection = function (req) {
    if (isDescending(req)) {
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

var ratingDescendingComparator = function (a, b) {
    return b.userRating - a.userRating;
};

var ratingAscendingComparator = function (a, b) {
    return a.userRating - b.userRating;
};

var sortByRating = function (req) {
    if (isAscending(req)) {
        stableSort.inplace(req.listings, ratingAscendingComparator);
    } else {
        stableSort.inplace(req.listings, ratingDescendingComparator);
    }
};

exports.postProcessSort = function (req) {
    if (req.query['sort'] === 'userRating') {
        sortByRating(req);
    }
};
