process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const jwt = require('jsonwebtoken');
const server = require('../server');
const config = require('../config/config');
const User = require('../app/models/user.model');
const VerificationToken = require('../app/models/verification-token.model');
const PasswordResetToken = require('../app/models/password-reset-token.model');

chai.use(chaiHttp);

const ROUTE_CREATE_ACCOUNT = '/create-account';
const ROUTE_RESEND_VERIFICATION = '/resend-verification';
const ROUTE_VERIFY = '/verify';
const ROUTE_SEND_PASSWORD_RESET = '/send-password-reset';
const ROUTE_RESET_PASSWORD = '/reset-password';
const ROUTE_LOGIN = '/login';
const ROUTE_AUTHENTICATE = '/authenticate';

const TOKEN_REGEX = /^[a-zA-Z0-9_\-]+\.[a-zA-Z0-9_\-]+\.[a-zA-Z0-9_\-]+$/;

describe('Users', function () {
    var token;
    var verificationTokens = [];
    var passwordResetTokens = [];

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
        }),
        new User({
            email: 'willResetPasswordAndIsVerified@gatech.edu',
            password: 'iAmGoingToResetMyPassword',
            firstName: 'AmAlready',
            lastName: 'Verified',
            isVerified: true
        }),
        new User({
            email: 'willResetPasswordAndIsNOTVerified@gatech.edu',
            password: 'iAmGoingToResetMyPasswordAndBecomeVerified',
            firstName: 'NotVerified',
            lastName: 'ButWilBecomeSo'
        })
    ];

    before(function (done) {
        User.remove({}, function (err) {
            VerificationToken.remove({}, function () {
                const errs = [];
                users.forEach(function (user) {
                    const processedUser = new User(user);
                    processedUser.email = processedUser.email.toLowerCase();
                    processedUser.save(function (err) {
                        errs.push(err);
                        if (errs.length === users.length) {
                            token = jwt.sign(users[0].toObject(), config.secret, {expiresIn: '5 minutes'});

                            verificationTokens.push(new VerificationToken({user: users[0]._id}));
                            verificationTokens.push(new VerificationToken({user: users[1]._id}));
                            verificationTokens.push(new VerificationToken({user: users[2]._id}));
                            verificationTokens.push(new VerificationToken({user: '5'}));

                            verificationTokens[0].save(function (err) {
                                verificationTokens[2].save(function (err) {
                                    verificationTokens[3].save(function (err) {
                                        passwordResetTokens.push(new PasswordResetToken({user: users[3]._id}));
                                        passwordResetTokens.push(new PasswordResetToken({user: users[4]._id}));
                                        passwordResetTokens.push(new PasswordResetToken({user: users[0]._id}));
                                        passwordResetTokens.push(new PasswordResetToken({user: '23'}));

                                        passwordResetTokens[0].save(function (err) {
                                            passwordResetTokens[1].save(function (err) {
                                                passwordResetTokens[3].save(function (err) {
                                                    done();
                                                });
                                            });
                                        });
                                    });
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
            VerificationToken.remove({}, function (err) {
                PasswordResetToken.remove({}, function (err) {
                    done();
                });
            });
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
            const currUser = userInfo[0];

            chai.request(server)
                .post(ROUTE_CREATE_ACCOUNT)
                .send(currUser)
                .end(function (err, res) {
                    checkMessageResponse(res, true, 503);
                    User.findOne({email: currUser.email.toLowerCase()}, function (err, user) {
                        expect(user).to.not.equal(null);
                        done();
                    });
                });
        });
        it('should not create an account with the same email address', function (done) {
            const currUser = userInfo[1];

            chai.request(server)
                .post(ROUTE_CREATE_ACCOUNT)
                .send(currUser)
                .end(function (err, res) {
                    checkMessageResponse(res, false, 400);
                    User.findOne({email: currUser.email.toLowerCase()}, function (err, user) {
                        expect(user).to.not.equal(null);
                        done();
                    });
                });
        });
        it('should not create an account with no email address', function (done) {
            const currUser = userInfo[2];

            chai.request(server)
                .post(ROUTE_CREATE_ACCOUNT)
                .send(currUser)
                .end(function (err, res) {
                    checkMessageResponse(res, false, 400);
                    User.findOne({email: currUser.email}, function (err, user) {
                        expect(user).to.equal(null);
                        done();
                    });
                });
        });
        it('should not create an account with no password', function (done) {
            const currUser = userInfo[3];

            chai.request(server)
                .post(ROUTE_CREATE_ACCOUNT)
                .send(currUser)
                .end(function (err, res) {
                    checkMessageResponse(res, false, 400);
                    User.findOne({email: currUser.email.toLowerCase()}, function (err, user) {
                        expect(user).to.equal(null);
                        done();
                    });
                });
        });
        it('should not create an account with no first name', function (done) {
            const currUser = userInfo[4];

            chai.request(server)
                .post(ROUTE_CREATE_ACCOUNT)
                .send(currUser)
                .end(function (err, res) {
                    checkMessageResponse(res, false, 400);
                    User.findOne({email: currUser.email.toLowerCase()}, function (err, user) {
                        expect(user).to.equal(null);
                        done();
                    });
                });
        });
        it('should not create an account with no last name', function (done) {
            const currUser = userInfo[5];

            chai.request(server)
                .post(ROUTE_CREATE_ACCOUNT)
                .send(currUser)
                .end(function (err, res) {
                    checkMessageResponse(res, false, 400);
                    User.findOne({email: currUser.email.toLowerCase()}, function (err, user) {
                        expect(user).to.equal(null);
                        done();
                    });
                });
        });
        it('should not create an account with an non-Georgia Tech email address', function (done) {
            const currUser = userInfo[6];

            chai.request(server)
                .post(ROUTE_CREATE_ACCOUNT)
                .send(currUser)
                .end(function (err, res) {
                    checkMessageResponse(res, false, 400);
                    User.findOne({email: currUser.email.toLowerCase()}, function (err, user) {
                        expect(user).to.equal(null);
                        done();
                    });
                });
        });
        it('should create an account with an just long enough password', function (done) {
            const currUser = userInfo[7];

            chai.request(server)
                .post(ROUTE_CREATE_ACCOUNT)
                .send(currUser)
                .end(function (err, res) {
                    checkMessageResponse(res, true, 503);
                    User.findOne({email: currUser.email.toLowerCase()}, function (err, user) {
                        expect(user).to.not.equal(null);
                        done();
                    });
                });
        });
        it('should not create an account with a too short password', function (done) {
            const currUser = userInfo[8];

            chai.request(server)
                .post(ROUTE_CREATE_ACCOUNT)
                .send(currUser)
                .end(function (err, res) {
                    checkMessageResponse(res, false, 400);
                    User.findOne({email: currUser.email.toLowerCase()}, function (err, user) {
                        expect(user).to.equal(null);
                        done();
                    });
                });
        });
    });

    describe('POST ' + ROUTE_RESEND_VERIFICATION, function () {
        it('should fail to resend verification email because the email service is down', function (done) {
            chai.request(server)
                .post(ROUTE_RESEND_VERIFICATION)
                .send({email: users[1].email})
                .end(function (err, res) {
                    checkMessageResponse(res, false, 503);
                    done();
                });
        });
        it('should not resend verification email for an email address with no user', function (done) {
            chai.request(server)
                .post(ROUTE_RESEND_VERIFICATION)
                .send({email: 'noAccount@gatech.edu'})
                .end(function (err, res) {
                    checkMessageResponse(res, false, 400);
                    done();
                });
        });
        it('should not resend verification email for a bad email address', function (done) {
            chai.request(server)
                .post(ROUTE_RESEND_VERIFICATION)
                .send({email: 'badEmailAddress@gmail.com'})
                .end(function (err, res) {
                    checkMessageResponse(res, false, 400);
                    done();
                });
        });
        it('should not resend verification email for an account that is already verified', function (done) {
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
            const verificationToken = verificationTokens[2];

            chai.request(server)
                .get(ROUTE_VERIFY + '/' + verificationToken.token)
                .end(function (err, res) {
                    checkMessageResponse(res, true, 200);
                    User.findOne({_id: verificationToken.user}, function (err, user) {
                        expect(user.isVerified).to.equal(true);
                        done();
                    });
                });
        });
        it('should not verify an account when the verification token is not saved', function (done) {
            const verificationToken = verificationTokens[1];

            chai.request(server)
                .get(ROUTE_VERIFY + '/' + verificationToken.token)
                .end(function (err, res) {
                    checkMessageResponse(res, false, 400);
                    User.findOne({_id: verificationToken.user}, function (err, user) {
                        expect(user.isVerified).to.equal(false);
                        done();
                    });
                });
        });
        it('should not verify an account when the user cannot be found', function (done) {
            chai.request(server)
                .get(ROUTE_VERIFY + '/' + verificationTokens[3].token)
                .end(function (err, res) {
                    checkMessageResponse(res, false, 400);
                    done();
                });
        });
        it('should not verify an account when the user is already verified', function (done) {
            const verificationToken = verificationTokens[0];

            chai.request(server)
                .get(ROUTE_VERIFY + '/' + verificationToken.token)
                .end(function (err, res) {
                    checkMessageResponse(res, false, 400);
                    User.findOne({_id: verificationToken.user}, function (err, user) {
                        expect(user.isVerified).to.equal(true);
                        done();
                    });
                });
        });
    });

    describe('POST ' + ROUTE_SEND_PASSWORD_RESET, function () {
        it('should fail to send password reset email because the email service is down', function (done) {
            chai.request(server)
                .post(ROUTE_SEND_PASSWORD_RESET)
                .send({email: users[3].email})
                .end(function (err, res) {
                    checkMessageResponse(res, false, 503);
                    done();
                });
        });
        it('should not password reset email for an email address with no user', function (done) {
            chai.request(server)
                .post(ROUTE_SEND_PASSWORD_RESET)
                .send({email: 'noAccount@gatech.edu'})
                .end(function (err, res) {
                    checkMessageResponse(res, false, 400);
                    done();
                });
        });
        it('should not password reset email for a bad email address', function (done) {
            chai.request(server)
                .post(ROUTE_SEND_PASSWORD_RESET)
                .send({email: 'badEmailAddress@gmail.com'})
                .end(function (err, res) {
                    checkMessageResponse(res, false, 400);
                    done();
                });
        });
    });

    describe('POST ' + ROUTE_RESET_PASSWORD, function () {
        it('should reset a password', function (done) {
            const passwordToken = passwordResetTokens[0];
            const testPassword = 'everyBodyMoveYourFeetAndFeelUnited';

            chai.request(server)
                .post(ROUTE_RESET_PASSWORD)
                .send({token: passwordToken.token, password: testPassword})
                .end(function (err, res) {
                    checkMessageResponse(res, true, 200);
                    User.findOne({_id: passwordToken.user}, function (err, user) {
                        expect(user.isVerified).to.equal(true);
                        PasswordResetToken.findOne({token: passwordToken.token}, function (err, token) {
                            expect(token).to.equal(null);
                            done();
                        });
                    });
                });
        });
        it('should not reset a password when the password is empty', function (done) {
            const passwordToken = passwordResetTokens[1];

            User.findOne({_id: passwordToken.user}, function (err, user) {
                chai.request(server)
                    .post(ROUTE_RESET_PASSWORD)
                    .send({token: passwordToken.token, password: ''})
                    .end(function (err, res) {
                        checkMessageResponse(res, false, 400);
                        User.findOne({_id: passwordToken.user}, function (err, updatedUser) {
                            expect(updatedUser.password).to.equal(user.password);
                            done();
                        });
                    });
            });
        });
        it('should not reset a password when the password is too short', function (done) {
            const passwordToken = passwordResetTokens[1];

            User.findOne({_id: passwordToken.user}, function (err, user) {
                chai.request(server)
                    .post(ROUTE_RESET_PASSWORD)
                    .send({token: passwordToken.token, password: 'a123456'})
                    .end(function (err, res) {
                        checkMessageResponse(res, false, 400);
                        User.findOne({_id: passwordToken.user}, function (err, updatedUser) {
                            expect(updatedUser.password).to.equal(user.password);
                            done();
                        });
                    });
            });
        });
        it('should not reset a password reset token is not saved', function (done) {
            chai.request(server)
                .post(ROUTE_RESET_PASSWORD)
                .send({token: passwordResetTokens[2].token, password: 'itDoesNotMatter'})
                .end(function (err, res) {
                    checkMessageResponse(res, false, 400);
                    done();
                });
        });
        it('should not reset a password when the user cannot be found', function (done) {
            chai.request(server)
                .post(ROUTE_RESET_PASSWORD)
                .send({token: passwordResetTokens[3].token, password: 'itDoesNotMatter'})
                .end(function (err, res) {
                    checkMessageResponse(res, false, 400);
                    done();
                });
        });
        it('should verify a user when the password is reset', function (done) {
            const passwordToken = passwordResetTokens[1];

            User.findOne({_id: passwordToken.user}, function (err, user) {
                chai.request(server)
                    .post(ROUTE_RESET_PASSWORD)
                    .send({token: passwordToken.token, password: 'aBrandNewPassword'})
                    .end(function (err, res) {
                        checkMessageResponse(res, true, 200);
                        User.findOne({_id: passwordToken.user}, function (err, updatedUser) {
                            expect(user.isVerified).to.equal(false);
                            expect(updatedUser.isVerified).to.equal(true);
                            PasswordResetToken.findOne({token: passwordToken.token}, function (err, token) {
                                expect(token).to.equal(null);
                                done();
                            });
                        });
                    });
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
        it('should authenticate the token',  function (done) {
            chai.request(server)
                .get(ROUTE_AUTHENTICATE)
                .set('authorization', token)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.equal(true);
                    done();
                });
        });
        it('should not authenticate if there is no token',  function (done) {
            chai.request(server)
                .get(ROUTE_AUTHENTICATE)
                .end(function (err, res) {
                    expect(res).to.have.status(401);
                    expect(res.body).to.equal(false);
                    done();
                });
        });
        it('should not authenticate a bad token',  function (done) {
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