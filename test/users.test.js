process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const server = require('../server');
const config = require('../config/config');
const User = require('../app/models/user.model');
const VerificationToken = require('../app/models/verification-token.model');

chai.use(chaiHttp);

const ROUTE_CREATE_ACCOUNT = '/create-account';
const ROUTE_RESEND_VERIFICATION = '/resend-verification';
const ROUTE_VERIFY = '/verify';
const ROUTE_LOGIN = '/login';
const ROUTE_AUTHENTICATE = '/authenticate';

const TOKEN_REGEX = /^[a-zA-Z0-9_\-]+\.[a-zA-Z0-9_\-]+\.[a-zA-Z0-9_\-]+$/;

describe('Users', function () {
    var token;
    var verificationTokens = [];

    var users = [
        new User({
            email: 'fakeEmail@gatech.edu',
            password: 'TheLamminator!',
            firstName: 'Ben',
            lastName: 'Lammers',
            isVerified: true
        }),
        new User({
            email: 'notVerified@gatech.edu',
            password: 'heyIamNotVerified',
            firstName: 'Not',
            lastName: 'Verified'
        }),
        new User({
            email: 'willVerify@gatech.edu',
            password: 'iAmGoingToBeVerifiedByTheTests',
            firstName: 'Will',
            lastName: 'Verify'
        })
    ];

    before(function (done) {
        User.remove({}, function (err) {
            VerificationToken.remove({}, function () {
                var errs = [];
                users.forEach(function (user) {
                    user.save(function (err) {
                        errs.push(err);
                        if (errs.length === users.length) {
                            token = jwt.sign(users[0].toObject(), config.secret, {expiresIn: '5 minutes'});

                            verificationTokens.push(new VerificationToken({user: users[0]._id,
                                token: crypto.randomBytes(16).toString('hex')}));
                            verificationTokens.push(new VerificationToken({user: users[1]._id,
                                token: crypto.randomBytes(16).toString('hex')}));
                            verificationTokens.push(new VerificationToken({user: users[2]._id,
                                token: crypto.randomBytes(16).toString('hex')}));

                            verificationTokens[0].save(function (err) {
                                verificationTokens[2].save(function () {
                                    done();
                                });
                            });
                        }
                    });
                });
            });
        });
    });
    after(function (done) {
        User.remove({}, function (err) {
            done();
        });
    });

    describe('POST ' + ROUTE_CREATE_ACCOUNT, function () {
        var userInfo = [{
            email: 'fakeEmail1@gatech.edu',
            password: 'burdell1885',
            firstName: 'Josh',
            lastName: 'Okogie'
        }, {
            email: users[0].email,
            password: 'imposter5',
            firstName: 'Faux',
            lastName: 'Player'
        }, {
            password: 'buyeveryonedoughnuts',
            firstName: 'Josh',
            lastName: 'Pastner'
        }, {
            email: 'fakeEmail2@gatech.edu',
            firstName: 'Tadric',
            lastName: 'Jackson'
        }, {
            email: 'fakeEmail3@gatech.edu',
            password: 'hesnumber34',
            lastname: 'Gueye'
        }, {
            email: 'fakeEmail4@gatech.edu',
            password: 'brooklyn10',
            firstName: 'Jose'
        }, {
            email: 'fakeEmail5@gmail.com',
            password: 'snellvillebball',
            firstName: 'Number',
            lastName: 'One'
        }, {
            email: 'fakeEmail6@gatech.edu',
            password: 'minimum1',
            firstName: 'Min',
            lastName: 'Password'
        }, {
            email: 'fakeEmail7@gatech.edu',
            password: 'minimum',
            firstName: 'Short',
            lastName: 'Pass'
        }];

        it('should successfully create a new account', function (done) {
            chai.request(server)
                .post(ROUTE_CREATE_ACCOUNT)
                .send(userInfo[0])
                .end(function (err, res) {
                    checkMessageResponse(res, true, 503);
                    done();
                });
        });
        it('should not create an account with the same email address', function (done) {
            chai.request(server)
                .post(ROUTE_CREATE_ACCOUNT)
                .send(userInfo[1])
                .end(function (err, res) {
                    checkMessageResponse(res, false, 400);
                    done();
                });
        });
        it('should not create an account with no email address', function (done) {
            chai.request(server)
                .post(ROUTE_CREATE_ACCOUNT)
                .send(userInfo[2])
                .end(function (err, res) {
                    checkMessageResponse(res, false, 400);
                    done();
                });
        });
        it('should not create an account with no password', function (done) {
            chai.request(server)
                .post(ROUTE_CREATE_ACCOUNT)
                .send(userInfo[3])
                .end(function (err, res) {
                    checkMessageResponse(res, false, 400);
                    done();
                });
        });
        it('should not create an account with no first name', function (done) {
            chai.request(server)
                .post(ROUTE_CREATE_ACCOUNT)
                .send(userInfo[4])
                .end(function (err, res) {
                    checkMessageResponse(res, false, 400);
                    done();
                });
        });
        it('should not create an account with no last name', function (done) {
            chai.request(server)
                .post(ROUTE_CREATE_ACCOUNT)
                .send(userInfo[5])
                .end(function (err, res) {
                    checkMessageResponse(res, false, 400);
                    done();
                });
        });
        it('should not create an account with an non-Georgia Tech email address', function (done) {
            chai.request(server)
                .post(ROUTE_CREATE_ACCOUNT)
                .send(userInfo[6])
                .end(function (err, res) {
                    checkMessageResponse(res, false, 400);
                    done();
                });
        });
        it('should create an account with an just long enough password', function (done) {
            chai.request(server)
                .post(ROUTE_CREATE_ACCOUNT)
                .send(userInfo[7])
                .end(function (err, res) {
                    checkMessageResponse(res, true, 503);
                    done();
                });
        });
        it('should not create an account with a too short password', function (done) {
            chai.request(server)
                .post(ROUTE_CREATE_ACCOUNT)
                .send(userInfo[8])
                .end(function (err, res) {
                    checkMessageResponse(res, false, 400);
                    done();
                });
        });
    });

    describe('POST ' + ROUTE_RESEND_VERIFICATION, function () {
        it('should fail to resend verification because the email service is down', function (done) {
            chai.request(server)
                .post(ROUTE_RESEND_VERIFICATION)
                .send({email: users[1].email})
                .end(function (err, res) {
                    checkMessageResponse(res, false, 503);
                    done();
                });
        });
        it('should not resend verification for a bad email address', function (done) {
            chai.request(server)
                .post(ROUTE_RESEND_VERIFICATION)
                .send({email: 'bademailaddress@gatech.edu'})
                .end(function (err, res) {
                    checkMessageResponse(res, false, 400);
                    done();
                });
        });
        it('should not resend verification for an account that is already verified', function (done) {
            chai.request(server)
                .post(ROUTE_RESEND_VERIFICATION)
                .send({email: users[0].email})
                .end(function (err, res) {
                    checkMessageResponse(res, false, 400);
                    done();
                });
        });
    });

    describe('GET ' + ROUTE_VERIFY, function () {
        it('should verify an account', function (done) {
            chai.request(server)
                .get(ROUTE_VERIFY + '/' + verificationTokens[2].token)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.text).to.be.a('string');
                    expect(res.text).to.not.equal(null);
                    expect(res.text).to.not.equal(undefined);
                    expect(res.text).to.not.equal('');
                    done();
                });
        });
        it('should not verify an account when the verification token is not saved', function (done) {
            chai.request(server)
                .get(ROUTE_VERIFY + '/' + verificationTokens[1].token)
                .end(function (err, res) {
                    checkMessageResponse(res, false, 400);
                    done();
                });
        });
        it('should not verify an account when the user is already verified', function (done) {
            chai.request(server)
                .get(ROUTE_VERIFY + '/' + verificationTokens[0].token)
                .end(function (err, res) {
                    checkMessageResponse(res, false, 400);
                    done();
                });
        });
    });

    describe('POST ' + ROUTE_LOGIN, function () {
        var credentials = [{
            email: users[0].email,
            password: users[0].password
        }, {
            email: 'bademailaddress@gatech.edu',
            password: users[0].password
        }, {
            email: users[0].email,
            password: 'badpassword'
        }];

        it('should log in successfully',  function (done) {
            chai.request(server)
                .post(ROUTE_LOGIN)
                .send(credentials[0])
                .end(function (err, res) {
                    checkMessageResponse(res, true, 200);
                    expect(res.body).to.have.property('token');
                    expect(res.body.token).to.match(TOKEN_REGEX);
                    done();
                });
        });
        it('should not log in for bad email',  function (done) {
            chai.request(server)
                .post(ROUTE_LOGIN)
                .send(credentials[1])
                .end(function (err, res) {
                    checkMessageResponse(res, false, 401);
                    done();
                });
        });
        it('should not log in for bad password',  function (done) {
            chai.request(server)
                .post(ROUTE_LOGIN)
                .send(credentials[2])
                .end(function (err, res) {
                    checkMessageResponse(res, false, 401);
                    done();
                });
        });
    });

    describe('GET ' + ROUTE_AUTHENTICATE, function () {
        it('should verify the token',  function (done) {
            chai.request(server)
                .get(ROUTE_AUTHENTICATE)
                .set('authorization', token)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.equal(true);
                    done();
                });
        });
        it('should not verify if there is no token',  function (done) {
            chai.request(server)
                .get(ROUTE_AUTHENTICATE)
                .end(function (err, res) {
                    expect(res).to.have.status(401);
                    expect(res.body).to.equal(false);
                    done();
                });
        });
        it('should not verify a bad token',  function (done) {
            chai.request(server)
                .get(ROUTE_AUTHENTICATE)
                .set('authorization', 'bad.token._123-456')
                .end(function (err, res) {
                    expect(res).to.have.status(401);
                    expect(res.body).to.equal(false);
                    done();
                });
        });
    });
});

function checkMessageResponse(res, expectedSuccess, expectedStatus) {
    expect(res).to.have.status(expectedStatus);
    expect(res.body).to.be.a('object');
    expect(res.body).to.have.property('successful');
    expect(res.body).to.have.property('text');
    expect(res.body.successful).to.equal(expectedSuccess);
    expect(res.body.text).to.not.equal(null);
    expect(res.body.text).to.not.equal(undefined);
    expect(res.body.text).to.not.equal('');
}