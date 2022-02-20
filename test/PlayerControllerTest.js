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

describe('PlayerControllerTest', () => {

  beforeEach(async () => {
    await db.resetTable('players');
  });

  afterEach(async () => {
    await db.resetTable('players');
  });

  it('Bisa tambah Player baru', async () => {
    const res = await chai.request(url)
      .post(`/player`)
      .send({
        msisdn: "6281210401298"
      });

    expect(res).to.have.status(200);
  });

  it('Tak bisa tambah Player dengan msisdn yang sama.', async () => {

    let res = await chai.request(url)
      .post(`/player`)
      .send({
        msisdn: "6281210401298"
      });

    expect(res).to.have.status(200);

     res = await chai.request(url)
      .post(`/player`)
      .send({
        msisdn: "6281210401298"
      });

    expect(res).to.have.status(400);
  });
  
});
