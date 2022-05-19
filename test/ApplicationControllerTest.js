const config = require('config');
const db = require('../lib/mysql-helper');
const dataSeeder = require('../lib/dataSeeder');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

let url = `${config.backendUrl}/api/v1`;
var expect = chai.expect;
var assert = chai.assert;

describe('ApplicationControllerTest', () => {

  describe('CRUD Operation', () => {
    beforeEach(async () => {
      await db.resetTable('content_provider');
      await db.resetTable('applications');
      await dataSeeder.populateCp();
    });

    afterEach(async () => {
      await db.resetTable('content_provider');
      await db.resetTable('applications');
    });

    it('Bisa tambah Application baru', async () => {
      const res = await chai.request(url)
        .post(`/application`)
        .send({
          app_alias: "mvicall",
          app_name: "Mvicall",
          cp_id: 1,
          url_init: "https://stg.serbahoki.id"
        });

      expect(res).to.have.status(200);
    });

    it('Tak bisa tambah Application dengan app_alias yang sama.', async () => {
      let res = await chai.request(url)
        .post(`/application`)
        .send({
          app_alias: "mvicall",
          app_name: "Mvicall",
          cp_id: 1,
          url_init: "https://stg.serbahoki.id"
        });

      expect(res).to.have.status(200);

      res = await chai.request(url)
        .post(`/application`)
        .send({
          app_alias: "mvicall",
          app_name: "aloalo",
          cp_id: 1,
          url_init: "https://asal-asalan.id"
        });

      expect(res).to.have.status(400);
    });

  });

  describe('Authorization', () => {

    beforeEach(async () => {
      await db.resetTable('content_provider');
      await db.resetTable('applications');
      await dataSeeder.populateCp();
      await dataSeeder.populateApplication();
    });

    afterEach(async () => {
      await db.resetTable('content_provider');
      await db.resetTable('applications');
    });

    it('Bisa cek apakah Application sudah di Authorized', async () => {
      const res = await chai.request(url)
        .get(`/auth`)
        .set({ "Authorization": `bearer eyJhcHBfYWxpYXMiOiJtdmljYWxsIiwiYXBwX25hbWUiOiJNdmljYWxsIiwiY3BfaWQiOjF9bWvpLVR51y9ubIRlDdMHpwyAbpAa` });

      expect(res).to.have.status(200);
    });

  });


});
