const config = require('config');
const db = require('../lib/mysql-helper');
const dataSeeder = require('../lib/dataSeeder');
const singleToken = require('../lib/singleToken');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

let url = `${config.backendUrl}/api/v1`;
var expect = chai.expect;
var assert = chai.assert;

var fs = require('fs');
const FormData = require('form-data');
const bent = require('bent');

let token = "";

describe('BannerControllerTest', () => {

  describe('CRUD Operation', () => {
    beforeEach(async () => {
      await db.resetTable('banners');
      token = await singleToken.generate();
    });

    afterEach(async () => {
    });

    it('Bisa tambah Banner baru', async () => {
      var form = new FormData();
      form.append('app_id', '13');
      form.append('telco_id', '2');
      form.append('name', 'Pesta Reward');
      form.append('description', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Convallis velit arcu et sit lacinia id. Nisl facilisi quisque senectus varius.');
      form.append('url', 'leaderboard');
      form.append('media', fs.createReadStream('assets/3plehoki.jpeg'));

      const header = form.getHeaders();
      const theHeader = {
        "Authorization": `bearer ${token}`,
        'content-type': header['content-type']
      };

      // const req = bent(url, 'POST', 200, 201, 400, 401, 500);
      const req = bent(url, 'POST', 'json', 201);
      const res = await req('/banner', form, theHeader).catch(err => { throw err; });
      
      // expect(res).to.have.status(201);
      expect(res.data).to.have.property('id', 1);
    });

    /*
    it(`Tidak Bisa tambah baru kalau input 'banner' tidak diisi`, async () => {
      var form = new FormData();
      form.append('app_id', '13');
      form.append('telco_id', '2');
      form.append('name', 'Pesta Reward');
      form.append('description', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Convallis velit arcu et sit lacinia id. Nisl facilisi quisque senectus varius.');
      form.append('url', 'leaderboard');

      const header = form.getHeaders();
      const theHeader = {
        'content-type': header['content-type']
      };

      const req = bent(url, 'POST', 201, 400, 500);
      const res = await req('/banner', form, theHeader).catch(err => { throw err; });
      
      expect(res).to.have.status(400);
    });

    it('Bisa update Banner', async () => {
      await dataSeeder.populateBanner1row();

      const form = new FormData();
      form.append('app_id', '13');
      form.append('telco_id', '2');
      form.append('name', 'Pesta Reward');
      form.append('description', 'Loremssss ipsum dolor sit amet.');
      form.append('url', 'leaderboard');
      form.append('media', fs.createReadStream('assets/3plehoki.jpeg'));

      const header = form.getHeaders();
      const theHeader = {
        'content-type': header['content-type']
      };

      req = bent(url, 'POST', 200, 400, 500);
      res = await req(`/banner/1`, form, theHeader).catch(err => { throw err; });

      expect(res).to.have.status(200);
      
    });

    it('Bisa delete Banner', async () => {
      await dataSeeder.populateBanner1row();
      const res = await chai.request(url)
        .delete(`/banner/1`)
        .send({});

      expect(res).to.have.status(200);
    });

    it('Bisa tampilkan semua Banner', async () => {
      await dataSeeder.populateBanner6row();
      const res = await chai.request(url)
        .get(`/banner`)
        .send({});

      expect(res).to.have.status(200);
    });
    */


  });


});
