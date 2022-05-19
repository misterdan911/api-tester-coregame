const config = require('config');
var mongoose = require('mongoose');
const mg = require('../lib/mongo-helper');
const jabatanModel = require('../models/jabatan');
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

// var departemenData = {
//   _id: '5eee3b196e1c8aba9544b0ac',
//   nama: 'Departemen Test'
// };
// var departemen;

var jabatanData1 = {
  _id: '5eee3b196e1c8aba9544b0ab',
  nama: 'Jabatan Testing1',
  departemen: "5eee3b196e1c8aba9544b0ac"
};
var jabatan1;

var jabatanData2 = {
  _id: '5f1513e76f459e2f366574f9',
  nama: 'Jabatan Testing2',
  departemen: "5eee3b196e1c8aba9544b0ac"
};
var jabatan2;

var userData1 = {
  _id: '5eee3b196e1c8aba9544b0aa',
  username: '20001',
  password: 'eoffice123',
  nama: "Mister Dan",
  email: "misterdan@gmail.com",
  phone: "089625097655",
  NIP: "20001",
  jabatan: "5eee3b196e1c8aba9544b0ab",
  departemen: "5eee3b196e1c8aba9544b0ac"
};
var user1;

var userData2 = {
  _id: '5f1513e74bdc435da78a4aba',
  username: '20002',
  password: 'eoffice123',
  nama: "Covid 19",
  email: "covid19@gmail.com",
  phone: "089625097655",
  NIP: "20002",
  jabatan: "5f1513e76f459e2f366574f9",
  departemen: "5eee3b196e1c8aba9544b0ac"
};
var user2;

//Our parent block
describe('JabatanControllerTest', () => {

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

  it('Cannot be accessed without login', async () => {
    const res = await chai.request(url)
      .get(`/jabatan/all/user`)
      .catch(err => { throw err; });
    expect(res).to.have.status(401);
  });

  describe('Wrap of all test', () => {

    beforeEach(async () => {
      jabatan1 = await new jabatanModel(jabatanData1);
      await jabatan1.save().catch(err => { throw err });
      user1 = await new userModel(userData1);
      await user1.save().catch(err => { throw err });

      jabatan2 = await new jabatanModel(jabatanData2);
      await jabatan2.save().catch(err => { throw err });
      user2 = await new userModel(userData2);
      await user2.save().catch(err => { throw err });

    });

    afterEach(async () => {
      await userModel.deleteOne({ _id: user1._id });
      await jabatanModel.deleteOne({ _id: jabatan1._id });
      await userModel.deleteOne({ _id: user2._id });
      await jabatanModel.deleteOne({ _id: jabatan2._id });
    });

    describe('GET /jabatan/search - Search by Query', () => {

      it(`Can search jabatan by 'nama' using HTML Query String`, async () => {
        const res = await chai.request(url)
          .get(`/jabatan/search?nama=${jabatanData1.nama}`)
          .set({ "Authorization": `Bearer ${theToken}` })
          .catch(err => { throw err; });

        let searchResult = 'DataNotFound';
        res.body.forEach(jab => {
          if (jab.nama == jabatanData1.nama) { searchResult = 'DataFound'; }
        });

        assert.equal(searchResult, 'DataFound');
      });

      it(`Won't find jabatan that has 'dihapus' flag set to true`, async () => {
        await jabatanModel.findOneAndUpdate({ _id: jabatanData1._id }, { $set: { dihapus: true } }, { new: true }).catch(err => { throw err });

        const res = await chai.request(url)
          .get(`/jabatan/search?nama=${jabatanData1.nama}`)
          .set({ "Authorization": `Bearer ${theToken}` })
          .catch(err => { throw err; });

        let searchResult = 'DataNotFound';
        res.body.forEach(jab => {
          if (jab.nama == jabatanData1.nama) { searchResult = 'DataFound'; }
        });

        assert.equal(searchResult, 'DataNotFound');
      });

    });

    describe('GET /jabatan/all/user - Get all jabatan who has pejabat', () => {

      it(`Can get all jabatan with populated user`, async () => {
        const res = await chai.request(url)
          .get(`/jabatan/all/user`)
          .set({ "Authorization": `Bearer ${theToken}` })
          .catch(err => { throw err; });

        let searchResult = 'DataNotFound';
        res.body.forEach(jab => {
          if (jab.nama == jabatanData1.nama) { searchResult = 'DataFound'; }
        });

        assert.equal(searchResult, 'DataFound');
      });

      it(`Won't find jabatan that has 'dihapus' flag set to true`, async () => {
        await jabatanModel.findOneAndUpdate({ _id: jabatan1._id }, { $set: { dihapus: true } }, { new: true }).catch(err => { throw err });

        const res = await chai.request(url)
          .get(`/jabatan/all/user`)
          .set({ "Authorization": `Bearer ${theToken}` })
          .catch(err => { throw err; });

        let searchResult = 'DataNotFound';
        res.body.forEach(jab => {
          if (jab.nama == jabatanData1.nama) { searchResult = 'DataFound'; }
        });

        assert.equal(searchResult, 'DataNotFound');
      });

    });

    describe(`GET /jabatan/all/noUser - Get all jabatan who doesn't have pejabat`, () => {

      it(`Can get all jabatan who doesn't have pejabat`, async () => {
        await userModel.findOneAndUpdate({ _id: user1._id }, { $set: { jabatan: null } }, { new: true }).catch(err => { throw err });
        const res = await chai.request(url)
          .get(`/jabatan/all/noUser`)
          .set({ "Authorization": `Bearer ${theToken}` })
          .catch(err => { throw err; });

        let searchResult = 'DataNotFound';
        res.body.forEach(jab => {
          if (jab.nama == jabatanData1.nama) { searchResult = 'DataFound'; }
        });

        assert.equal(searchResult, 'DataFound');
      });

      it(`Won't find jabatan that has 'dihapus' flag set to true`, async () => {
        await jabatanModel.findOneAndUpdate({ _id: jabatan1._id }, { $set: { dihapus: true } }, { new: true }).catch(err => { throw err });

        const res = await chai.request(url)
          .get(`/jabatan/all/noUser`)
          .set({ "Authorization": `Bearer ${theToken}` })
          .catch(err => { throw err; });

        let searchResult = 'DataNotFound';
        res.body.forEach(jab => {
          if (jab.nama == jabatanData1.nama) { searchResult = 'DataFound'; }
        });

        assert.equal(searchResult, 'DataNotFound');
      });

    });

    describe(`GET /jabatan/:id - Get jabatan by ID`, () => {
      it(`Should get jabatan by ID`, async () => {
        const res = await chai.request(url)
          .get(`/jabatan/${jabatan1._id}`)
          .set({ "Authorization": `Bearer ${theToken}` })
          .catch(err => { throw err; });
        expect(res).to.have.status(200);
      });
      it(`Should not get jabatan with 'dihapus' flag set to true`, async () => {
        await jabatanModel.findOneAndUpdate({ _id: jabatan1._id }, { $set: { dihapus: true } }, { new: true }).catch(err => { throw err });
        const res = await chai.request(url)
          .get(`/jabatan/${jabatan1._id}`)
          .set({ "Authorization": `Bearer ${theToken}` })
          .catch(err => { throw err; });
        assert.equal(Object.keys(res.body).length, 0);
      });
    });

    describe('PATCH /jabatan/assistance/set - Set assistance', () => {

      it('Should set assistance for jabatan', async () => {
        const res = await chai.request(url)
          .patch(`/jabatan/assistance/set`)
          .set({ "Authorization": `Bearer ${theToken}` })
          .send({ sekretaris: "Jabatan Testing2" })
          .catch(err => { throw err; });
        expect(res).to.have.status(200);
      });

    });

    describe('PATCH /jabatan/assistance/unset - Unset assistance', () => {

      it('Should unset assistance for jabatan', async () => {
        const res = await chai.request(url)
          .patch(`/jabatan/assistance/unset`)
          .set({ "Authorization": `Bearer ${theToken}` })
          .catch(err => { throw err; });
        expect(res).to.have.status(200);
      });

    });

    describe(`GET /jabatan - Get all jabatan`, () => {

      it(`Should get all jabatan`, async () => {
        const res = await chai.request(url)
          .get(`/jabatan`)
          .set({ "Authorization": `Bearer ${theToken}` })
          .catch(err => { throw err; });
          assert.isArray(res.body, 'Array of jabatan');
      });

      it(`Should not include jabatan with 'dihapus' flag set to true`, async () => {
        await jabatanModel.findOneAndUpdate({ _id: jabatan1._id }, { $set: { dihapus: true } }, { new: true }).catch(err => { throw err });

        const res = await chai.request(url)
          .get(`/jabatan`)
          .set({ "Authorization": `Bearer ${theToken}` })
          .catch(err => { throw err; });

        let searchResult = 'DataNotFound';
        res.body.forEach(jab => {
          if (jab.nama == jabatanData1.nama) { searchResult = 'DataFound'; }
        });

        assert.equal(searchResult, 'DataNotFound');
      });

    });

    describe(`PUT /jabatan/:id`, () => {
      it(`Should only be able to update certain field of jabatan`);
      it(`Should not be able to update 'nama'`);
    });

    describe('DELETE /jabatan/:id - Delete Jabatan', () => {

      it(`Cannot set 'dihapus' flag to true on a jabatan who still have a user`, async () => {
        const res = await chai.request(url)
          .delete(`/jabatan/${jabatan1._id}`)
          .set({ "Authorization": `Bearer ${theToken}` })
          .catch(err => { throw err; });
        expect(res).to.have.status(409);
      });

      it(`should set 'dihapus' flag to true on a jabatan who doesn't have user`, async () => {
        await userModel.findOneAndUpdate({ _id: user1._id }, { $set: { jabatan: undefined } }, { new: true }).catch(err => { throw err });
        const res = await chai.request(url)
          .delete(`/jabatan/${jabatan1._id}`)
          .set({ "Authorization": `Bearer ${theToken}` })
          .catch(err => { throw err; });
        expect(res).to.have.status(200);
      });

    });

  });

});