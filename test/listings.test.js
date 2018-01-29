process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const jwt = require('jsonwebtoken');
const server = require('../server');
const config = require('../config/config');
const User = require('../app/models/user.model');
const Listing = require('../app/models/listing.model');

chai.use(chaiHttp);

const ROUTE_LISTINGS = '/listings';

describe('Listings', function () {
    var token;
    
    var listings = [
        new Listing({
            name: 'Samsung 55\' 4K LED TV',
            description: 'Used it for about a year. Still in really good condition. Put it back in the original box.',
            price: 500,
            imageUrl: 'https://i.ebayimg.com/images/g/MPkAAOSwIFtaCffc/s-l1600.jpg'
        }),
        new Listing({
            name: 'Gaming Chair',
            description: 'Really comfortable pc gaming chair. I\'ve no room for it in my new apartment, so it\'s gotta',
            price: 60,
            imageUrl: 'https://i.ebayimg.com/images/g/u5wAAOSwfrxZxbA7/s-l1600.jpg'
        }),
        new Listing({
            name: 'Keurig Coffee Maker',
            description: 'Brand new coffee maker! I never opened it. It\'s still its shrink wrapped package.',
            price: 34,
            imageUrl: 'https://i.ebayimg.com/images/g/8E0AAOSwaEhZI4Dc/s-l1600.jpg'
        }),
        new Listing({
            name: 'Buzz Bobblehead',
            description: 'A buzz bobblehead. Does not come with the box.',
            price: 24,
            imageUrl: 'https://i.ebayimg.com/images/g/1woAAOSw6b9Z312M/s-l1600.jpg'
        }),
        new Listing({
            name: 'Georgia Tech T-Shirt',
            description: 'A vintage Georgia Tech T-shirt from the late 70\'s. I found it in th back of my closet, so',
            price: 19,
            imageUrl: 'https://i.ebayimg.com/images/g/~nQAAOSwOgdYoGjk/s-l1600.jpg'
        }),
        new Listing({
            name: 'ACC Basketball',
            description: 'An old basketball with ACC teams printed on it. Yeah, the national champs are right there on',
            price: 8,
            imageUrl: 'https://i.ebayimg.com/images/g/AjUAAOSwdW9aCN5R/s-l1600.jpg'
        })
    ];

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
                    var errs = [];
                    listings.forEach(function (listing) {
                        listing.save(function (err) {
                            errs.push(err);
                            if (errs.length === listings.length) {
                                done();
                            }
                        });
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

    describe('GET ' + ROUTE_LISTINGS, function () {
        it('should successfully return listings', function (done) {
            chai.request(server)
                .get(ROUTE_LISTINGS)
                .set('authorization', token)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body).to.have.length(listings.length);
                    res.body.forEach(function (listing) {
                        expect(listing).to.have.property('name');
                        expect(listing).to.have.property('description');
                        expect(listing).to.have.property('price');
                        expect(listing).to.have.property('imageUrl');
                        expect(listing.name).to.not.equal(null);
                        expect(listing.name).to.not.equal(undefined);
                        expect(listing.description).to.not.equal(null);
                        expect(listing.description).to.not.equal(undefined);
                        expect(listing.price).to.not.equal(null);
                        expect(listing.price).to.not.equal(undefined);
                        expect(listing.imageUrl).to.not.equal(null);
                        expect(listing.imageUrl).to.not.equal(undefined);
                    });
                    done();
                });
        });
        it('should not return listings if there is no token', function (done) {
            chai.request(server)
                .get(ROUTE_LISTINGS)
                .end(function (err, res) {
                    expect(res).to.have.status(401);
                    expect(res.text).to.equal('unauthorized');
                    done();
                });
        });
        it('should not return listings if there is a bad token', function (done) {
            chai.request(server)
                .get(ROUTE_LISTINGS)
                .set('authorization', 'bad.token._123-456')
                .end(function (err, res) {
                    expect(res).to.have.status(401);
                    expect(res.text).to.equal('unauthorized');
                    done();
                });
        });
    });
});