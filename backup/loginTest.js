const config = require('config');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let url = config.backendUrl;


chai.use(chaiHttp);
var expect = chai.expect;

//Our parent block
describe('Login API Test', () => {

  /*
  * Test the /GET route
  */
  describe('POST /auth/login', () => {

    it('should be able to signed in with the correct username & password', (done) => {
      chai.request(url)
        .post('/auth/login')
        .send({
          username: config.sa.username,
          password: config.sa.password
        })
        .then(function (res) {
          expect(res).to.have.status(201);
          done();
        })
        .catch(function (err) {
          throw err;
        });
    });

    it('should not be able to signed in with the wrong password', (done) => {
      chai.request(url)
        .post('/auth/login')
        .send({ username: '10001', password: 'eoffice1234' })
        .then(function (res) {
          expect(res).to.have.status(401);
          done();
        })
        .catch(function (err) {
          throw err;
        });
    });


  });

});