const config = require('config');
var mongoose = require('mongoose');
const mg = require('../lib/mongo-helper');
const kopsuratModel = require('../models/kopsurat');
const filesModel = require('../models/files');

// Data Dummy
const {
  kopSurat_WithoutLogo,
  kopSurat_Logonya_jpg,
  kopSurat_Logonya_jpeg,
  kopSurat_Logonya_png,
  kopSurat_Logonya_gif,
  kopSurat_Logonya_bmp,
} = require('../data-dummy/kopsuratControllerTest');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

// var fs = require('fs');
const FormData = require('form-data');
const bent = require('bent');

let url = config.backendUrl;
var expect = chai.expect;
var assert = chai.assert;
var theToken = "";
var idKopsurat;



//Our parent block
describe('KopsuratControllerTest', () => {

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
      .get(`/kopsurat`)
      .catch(err => { throw err; });
    expect(res).to.have.status(401);
  });

  describe('Wrap of all test', () => {

    beforeEach(async () => {
      await kopsuratModel.deleteMany({});
    });

    describe('POST /kopsurat - Create new Kopsurat', () => {

      it('Should create new Kopsurat without logo', async () => {
        const res = await chai.request(url)
          .post('/kopsurat')
          .set({ "Authorization": `Bearer ${theToken}` })
          .send(kopSurat_WithoutLogo)
          .catch(function (err) {
            throw err;
          });

        expect(res).to.have.status(201);
      });
      it('Should create new Kopsurat with logo', async () => {
        const form = kopSurat_Logonya_jpg();
        const header = form.getHeaders();
        const theHeader = {
          "Authorization": `Bearer ${theToken}`,
          'content-type': header['content-type']
        };

        const req = bent(url, 'POST', 201);
        const res = await req('/kopsurat', form, theHeader).catch(err => { throw err; });
        expect(res).to.have.status(201);
      });
      it('Should save logo to files collection', async () => {
        const form = kopSurat_Logonya_jpg();
        const header = form.getHeaders();
        const theHeader = {
          "Authorization": `Bearer ${theToken}`,
          'content-type': header['content-type']
        };

        const req = bent(url, 'POST', 'json', 201);
        const res = await req('/kopsurat', form, theHeader).catch(err => { throw err; });

        const kop = await kopsuratModel.findOne({ _id: res._id });
        const files = await filesModel.findOne({ _id: kop.logo });

        assert(kop.logo !== files._id, 'Logo saved in files');
      });
      it('Should accept logo in jpg, jpeg, png, or gif', async () => {
        let form = kopSurat_Logonya_jpg();
        let header = form.getHeaders();
        let theHeader = {
          "Authorization": `Bearer ${theToken}`,
          'content-type': header['content-type']
        };

        let req = bent(url, 'POST', 201);
        let res = await req('/kopsurat', form, theHeader).catch(err => { throw err; });
        expect(res).to.have.status(201);

        form = kopSurat_Logonya_jpeg();
        req = bent(url, 'POST', 201);
        res = await req('/kopsurat', form, theHeader).catch(err => { throw err; });
        expect(res).to.have.status(201);

        form = kopSurat_Logonya_png();
        req = bent(url, 'POST', 201);
        res = await req('/kopsurat', form, theHeader).catch(err => { throw err; });
        expect(res).to.have.status(201);

        form = kopSurat_Logonya_gif();
        req = bent(url, 'POST', 201);
        res = await req('/kopsurat', form, theHeader).catch(err => { throw err; });
        expect(res).to.have.status(201);
      });
      it('Cannot accept logo other than jpg, jpeg, png, or gif', async () => {
        let form = kopSurat_Logonya_bmp();
        let header = form.getHeaders();
        let theHeader = {
          "Authorization": `Bearer ${theToken}`,
          'content-type': header['content-type']
        };

        let req = bent(url, 'POST', 415);
        let res = await req('/kopsurat', form, theHeader).catch(err => { throw err; });
        expect(res).to.have.status(415);
      });
      it('Cannot create Kopsurat if one of the jabatan is used in another Kopsurat', async () => {
        let res = await chai.request(url)
          .post('/kopsurat')
          .set({ "Authorization": `Bearer ${theToken}` })
          .send(kopSurat_WithoutLogo)
          .catch(function (err) {
            throw err;
          });
        res = await chai.request(url)
          .post('/kopsurat')
          .set({ "Authorization": `Bearer ${theToken}` })
          .send(kopSurat_WithoutLogo)
          .catch(function (err) {
            throw err;
          });

        expect(res).to.have.status(409);
      });

    });

    describe('PATCH /kopsurat/:id - Update existing Kopsurat', () => {

      beforeEach(async () => {
        const form = kopSurat_Logonya_jpg();
        const header = form.getHeaders();
        const theHeader = {
          "Authorization": `Bearer ${theToken}`,
          'content-type': header['content-type']
        };

        const req = bent(url, 'POST', 'json', 201);
        const res = await req('/kopsurat', form, theHeader).catch(err => { throw err; });
        idKopsurat = res._id;
      });

      it('Should update existing Kopsurat baris_1', async () => {
        const baris_1 = "baris_1 updated";

        const res = await chai.request(url)
          .patch(`/kopsurat/${idKopsurat}`)
          .set({ "Authorization": `Bearer ${theToken}` })
          .send({ baris_1: baris_1 })
          .catch(function (err) {
            throw err;
          });

        const kop = await kopsuratModel.findOne({ _id: idKopsurat });
        assert(kop.baris_1 == baris_1, 'Updated kopsurat');

      });
      it('Should update existing Kopsurat logo', async () => {
        const form = kopSurat_Logonya_jpeg();
        const header = form.getHeaders();
        const theHeader = {
          "Authorization": `Bearer ${theToken}`,
          'content-type': header['content-type']
        };

        const req = bent(url, 'PATCH', 'json', 200, 201);
        const res = await req(`/kopsurat/${idKopsurat}`, form, theHeader).catch(err => { throw err; });

        const kop = await kopsuratModel.findOne({ _id: idKopsurat });
        const files = await filesModel.findOne({ _id: kop.logo });

        assert(files.originalname == 'logo.jpeg', 'Updated logo');

      });
      it('Should accept logo in jpg, jpeg, png, or gif', async () => {
        let form = kopSurat_Logonya_jpg();
        let header = form.getHeaders();
        let theHeader = {
          "Authorization": `Bearer ${theToken}`,
          'content-type': header['content-type']
        };

        let req = bent(url, 'PATCH', 200, 201);
        let res = await req(`/kopsurat/${idKopsurat}`, form, theHeader).catch(err => { throw err; });
        expect(res).to.have.status(200);

        form = kopSurat_Logonya_jpeg();
        req = bent(url, 'PATCH', 200, 201);
        res = await req(`/kopsurat/${idKopsurat}`, form, theHeader).catch(err => { throw err; });
        expect(res).to.have.status(200);

        form = kopSurat_Logonya_png();
        req = bent(url, 'PATCH', 200, 201);
        res = await req(`/kopsurat/${idKopsurat}`, form, theHeader).catch(err => { throw err; });
        expect(res).to.have.status(200);

        form = kopSurat_Logonya_gif();
        req = bent(url, 'PATCH', 200, 201);
        res = await req(`/kopsurat/${idKopsurat}`, form, theHeader).catch(err => { throw err; });
        expect(res).to.have.status(200);
      });
      it('Cannot accept logo other than jpg, jpeg, png, or gif', async () => {
        let form = kopSurat_Logonya_bmp();
        let header = form.getHeaders();
        let theHeader = {
          "Authorization": `Bearer ${theToken}`,
          'content-type': header['content-type']
        };

        let req = bent(url, 'PATCH', 415);
        let res = await req(`/kopsurat/${idKopsurat}`, form, theHeader).catch(err => { throw err; });
        expect(res).to.have.status(415);
      });
      it('Should update existing Kopsurat if jabatan is the same', async () => {
        const baris_1 = "baris_1 updated";
        const jabatan = "Presiden RI;Sekretariat";

        const res = await chai.request(url)
          .patch(`/kopsurat/${idKopsurat}`)
          .set({ "Authorization": `Bearer ${theToken}` })
          .send({
            baris_1: baris_1,
            jabatan: jabatan
          })
          .catch(function (err) {
            throw err;
          });

        const kop = await kopsuratModel.findOne({ _id: idKopsurat });
        assert(kop.baris_1 == baris_1, 'Updated kopsurat');

      });
      it('Cannot update Kopsurat if one of the jabatan is used in another Kopsurat', async () => {
        let res = await chai.request(url)
          .post('/kopsurat')
          .set({ "Authorization": `Bearer ${theToken}` })
          .send({
            baris_1: "Test",
            jabatan: "Presiden RI 2; Sekretariat 2"
          })
          .catch(function (err) {
            throw err;
          });

        const idKop = res.body._id;

        res = await chai.request(url)
          .patch(`/kopsurat/${idKop}`)
          .set({ "Authorization": `Bearer ${theToken}` })
          .send({ jabatan: "Presiden RI" })
          .catch(function (err) {
            throw err;
          });

        expect(res).to.have.status(409);
      });

    });

  });

});