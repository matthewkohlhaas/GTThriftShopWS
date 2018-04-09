var arrayContains = require('array-contains');
var stableSort = require('stable');
var listing = require('../models/listing.model');

const ATTRIBUTES = ['price', 'createdAt'];

var isListingCategory = function (category) {
    return arrayContains(listing.schema.path('category').enumValues, category);
};
exports.isListingCategory = isListingCategory;

var addBlockUsersOption = function (req, options, blockedUsers) {
    if (blockedUsers) {
        options['user'] = {$nin: blockedUsers};
    }
};

var addSearchOption = function (req, options) {
    const searchString = req.query['search'];
    if (searchString && searchString !== '' && searchString !== '""') {
        options['$text'] = {$search: searchString};
    }
};

var addCategoryOption = function (req, options) {
    var category_query = req.query['category'];
    if (!category_query) {
        return;
    }
    if (category_query === 'all') {
        return;
    }
    if (isListingCategory(category_query)) {
        options['category'] = category_query;
    }
};

exports.generateListingsFindOptions = function (req, blockedUsers) {
    const options = {};
    addBlockUsersOption(req, options, blockedUsers);
    addSearchOption(req, options);
    addCategoryOption(req, options);
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
