process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const server = require('../server');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../app/models/user.model');
const Listing = require('../app/models/listing.model');

chai.use(chaiHttp);

const ROUTE_LISTINGS = '/listings';

describe('Listings', function () {
    var token;

    before(function (done) {
        var user = new User({
            email: 'fakeEmail@gatech.edu',
            password: 'TheLamminator!',
            firstName: 'Ben',
            lastName: 'Lammers',
            isVerified: true
        });
        User.remove({}, function (err) {
            Listing.remove({}, function (err) {
                user.save(function (err) {
                    token = jwt.sign(user.toObject(), config.secret, {expiresIn: '5 minutes'});
                    done();
                });
            });
        });
    });
    after(function (done) {
        User.remove({}, function (err) {
            Listing.remove({}, function (err) {
                done();
            });
        });
    });

    // TODO flesh out tests once create listing is implemented
    describe('GET ' + ROUTE_LISTINGS, function () {
        it('should successfully return listings', function (done) {
            chai.request(server)
                .get(ROUTE_LISTINGS)
                .set('authorization', token)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });
        it('should not return listings if there is no token', function (done) {
            chai.request(server)
                .get(ROUTE_LISTINGS)
                .end(function (err, res) {
                    expect(res).to.have.status(401);
                    done();
                });
        });
        it('should not return listings if there is a bad token', function (done) {
            chai.request(server)
                .get(ROUTE_LISTINGS)
                .set('authorization', 'bad.token._123-456')
                .end(function (err, res) {
                    expect(res).to.have.status(401);
                    done();
                });
        });
    });
});