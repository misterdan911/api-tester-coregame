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

describe('PrizeItemControllerTest', () => {

  beforeEach(async () => {
    await db.resetTable('prize_items');
  });

  afterEach(async () => {
    await db.resetTable('prize_items');
  });

  it('Bisa tambah Prize Item baru', async () => {
    const res = await chai.request(url)
      .post(`/prizeItem`)
      .send({
        alias: "iphone7",
        name: "iPhone 7",
        app_id: "1",
        point: "20",
        img: "image"
      });

    expect(res).to.have.status(200);
  });


});
