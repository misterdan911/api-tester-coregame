const config = require('config');
const db = require('../lib/mysql-helper');
const dataSeeder = require('../lib/dataSeeder');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

let url = `${config.backendUrl}/api/v1`;
var expect = chai.expect;

describe('InboxControllerTest', () => {

  describe('CRUD Operation', () => {
    beforeEach(async () => {
      await db.resetTable('inbox');
    });

    afterEach(async () => {
    });

    it('Bisa tambah Message baru', async () => {
      const res = await chai.request(url)
        .post('/inbox')
        .send({
          app_id: 13,
          msisdn: 6289525097655,
          message: "Selamat datang di 3PleHoki"
        })
        .catch(function (err) {
          throw err;
        });

      expect(res.body.data).to.have.property('id', 1);
    });



  });


});
