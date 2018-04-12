var arrayContains = require('array-contains');
var stableSort = require('stable');

const ATTRIBUTES = ['price', 'createdAt'];

exports.generateListingsFindOptions = function (req, blockedUsers) {
    const options = {};
    if (blockedUsers) {
        options['user'] = {$nin: blockedUsers};
    }
    const searchString = req.query['search'];
    if (searchString && searchString !== '' && searchString !== '""') {
        options['$text'] = {$search: searchString};
    }
    return options;
};

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
    if (isAscending(req)) {
        return 'ascending';
    }
    return 'descending';
};

exports.addSortToQuery = function (query, req) {
    var attribute = getAttribute(req);
    if (!attribute) {
        attribute = 'createdAt';
    }
    var direction = getDirection(req);
    var sortParam = [attribute, direction];
    query.sort([sortParam]);
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
