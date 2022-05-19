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

describe('GameControllerTest', () => {

  beforeEach(async () => {
    await db.resetTable('single_token');
  });

  afterEach(async () => {
    await db.resetTable('single_token');
  });

  it('Generate and save the single_token', async () => {
    const res = await chai.request(url)
      .post(`/trivia/tokenGen`)
      .set({ "Authorization": `bearer eyJhcHBfYWxpYXMiOiJiYWxhcGhva2kiLCJhcHBfbmFtZSI6IkJhbGFwIEhva2kiLCJjcF9pZCI6NH0=XJv9ZWNPfvv7eQOqIPt9` })
      .send({
        msisdn: "6285612345678"
      });

    expect(res).to.have.status(200);
  });

});
