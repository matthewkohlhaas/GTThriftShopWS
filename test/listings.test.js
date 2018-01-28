process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const server = require('../server');
const User = require('../app/models/user.model');
const Listing = require('../app/models/listing.model');

chai.use(chaiHttp);

const ROUTE_LISTINGS = '/listings';

describe('Listings', function () {
    var token;

    before(function (done) {
        var userInfo = {
            email: 'blammers3@gatech.edu',
            password: 'TheLamminator!',
            firstName: 'Ben',
            lastName: 'Lammers'
        };
        User.remove({}, function (err) {
            Listing.remove({}, function (err) {
                chai.request(server)
                    .post('/create-account')
                    .send(userInfo)
                    .end(function (err, res) {
                        chai.request(server)
                            .post('/login')
                            .send({email: userInfo.email, password: userInfo.password})
                            .end(function (err, res) {
                                token = res.body.token;
                                done();
                            });
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