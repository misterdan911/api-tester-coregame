const config = require('config');
const db = require('../lib/mysql-helper');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

let url = `${config.backendUrl}/api/v1`;
var expect = chai.expect;
var assert = chai.assert;

describe('ContentProviderControllerTest', () => {

  beforeEach(async () => {
    await db.resetTable('content_provider');
  });

  afterEach(async () => {
    await db.resetTable('content_provider');
  });

  it('Bisa tambah CP baru', async () => {
      const res = await chai.request(url)
        .post(`/cp`)
        .send({
          cp_alias: "sbi",
          cp_name: "Sinergi Bestama"
        });

      expect(res).to.have.status(200);
  });

  it('Tak bisa tambah CP dangan cp_alias yang sama', async () => {
      let res = await chai.request(url)
        .post(`/cp`)
        .send({
          cp_alias: "sbi",
          cp_name: "Sinergi Bestama"
        });

      expect(res).to.have.status(200);

      res = await chai.request(url)
        .post(`/cp`)
        .send({
          cp_alias: "sbi",
          cp_name: "Surya Buana Indonesia"
        });

      expect(res).to.have.status(400);
  });

});
