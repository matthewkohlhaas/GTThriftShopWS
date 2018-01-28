process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const User = require('../app/models/user.model');
const expect = chai.expect;

chai.use(chaiHttp);

const ROUTE_CREATE_ACCOUNT = '/create-account';

describe('Users', function () {
    var token;

    beforeEach(function (done) {
        User.remove({}, function (err) {
            done();
        });
    });

    describe('POST ' + ROUTE_CREATE_ACCOUNT, function () {
        var credentials = {
            email: 'jokogie3@gatech.edu',
            password: 'burdell1885',
            firstName: 'Josh',
            lastName: 'Okogie'
        };
        it('should successfully create a new account', function (done) {
            chai.request(server)
                .post(ROUTE_CREATE_ACCOUNT)
                .send(credentials)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('successful');
                    expect(res.body).to.have.property('text');
                    expect(res.body.successful).to.be.true;
                    expect(res.body.text).to.not.be.null;
                    expect(res.body.text).to.not.be.undefined;
                    expect(res.body.text).to.not.equal('');
                    done();
                });
        })
    });
});