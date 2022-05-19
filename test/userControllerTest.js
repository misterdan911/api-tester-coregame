const config = require('config');
const mg = require('../lib/mongo-helper');
const userModel = require('../models/user');
const bent = require('bent');
const FormData = require('form-data');


//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

let url = config.backendUrl;
var expect = chai.expect;
var assert = chai.assert;
var theToken = "";

var oriLoggedUserData;

var userData = {
  username: '20001',
  password: 'eoffice123',
  nama: "Mister Dan",
  email: "misterdan@gmail.com",
  phone: "089625097655",
  NIP: "20001",
  jabatan: "5eee3b196e1c8aba9544b0ab",
  departemen: "5eee3b196e1c8aba9544b0ac"
};
var userId;
const namaBaru = "Mister Danu";

//Our parent block
describe('UserControllerTest', () => {

  before(async () => {
    await mg.connect();

    const res = await chai.request(url)
      .post('/auth/login')
      .send({
        username: config.sa.username,
        password: config.sa.password
      });

    theToken = res.body.token;
  });

  after(async () => {
    await mg.close();
  });


  describe('POST /user', () => {

    before(async () => {
      await userModel.deleteMany({ username: userData.username });
    });

    after(async () => {
      await userModel.deleteMany({ username: userData.username });
    });

    it('should be able to create new user', async () => {
      const res = await chai.request(url)
        .post('/user')
        .set({ "Authorization": `Bearer ${theToken}` })
        .send(userData)
        .catch(function (err) {
          throw err;
        });

      expect(res).to.have.status(201);
    });

  });

  describe('PATCH /user/su/:userID', () => {

    before(async () => {
      const newUser = new userModel(userData);
      const res = await newUser.save();
      userId = res._id;
    });

    after(async () => {
      await userModel.deleteMany({ username: userData.username });
    });

    it('should be able to update other user', async () => {

      await chai.request(url)
        .patch(`/user/su/${userId}`)
        .set({ "Authorization": `Bearer ${theToken}` })
        .send({ nama: namaBaru })
        .catch(err => { throw err; });

      const updatedUser = await userModel.findOne({ _id: userId });
      assert.equal(updatedUser.nama, namaBaru);

    });

  });

  describe('PATCH /user/me', () => {
    before(async () => {
      oriLoggedUserData = await userModel.findOne({ username: config.sa.username }).catch(err => { throw err; });
    });
    after(async () => {
      await userModel.findOneAndUpdate({ username: config.sa.username }, { nama: oriLoggedUserData.nama }).catch(err => { throw err; });
    });

    it('logged user should be able to edit his own profile', async () => {
      var form = new FormData();
      form.append('nama', namaBaru);
      const header = form.getHeaders();

      const theHeader = {
        "Authorization": `Bearer ${theToken}`,
        'content-type': header['content-type']
      };

      const req = bent(url, 'PATCH', 'json', 200, 201, 400, 401, 404, 406, 500);
      const res = await req('/user/me', form, theHeader).catch(err => { throw err; });
      const userData = await userModel.findOne({ _id: oriLoggedUserData._id });
      assert.equal(userData.nama, namaBaru);
    });
  });

  describe('DELETE /user/:id', () => {

    beforeEach(async () => {
      const newUser = new userModel(userData);
      const res = await newUser.save();
      userId = res._id;
    });

    afterEach(async () => {
      await userModel.deleteMany({ username: userData.username });
    });

    it(`should set 'dihapus' flag to true on a user who doesn't have jabatan`, async () => {
      await userModel.updateOne({ _id: userId }, { $set: { jabatan: null } });
      await chai.request(url)
        .delete(`/user/${userId}`)
        .set({ "Authorization": `Bearer ${theToken}` })
        .catch(err => { throw err; });

      const user = await userModel.findById(userId);
      assert.equal(user.dihapus, true);
    });

    it(`Cannot set 'dihapus' flag to true on a user who still have jabatan`, async () => {
      const res = await chai.request(url)
        .delete(`/user/${userId}`)
        .set({ "Authorization": `Bearer ${theToken}` })
        .catch(err => { throw err; });

      expect(res).to.have.status(409);
    });
  });

});