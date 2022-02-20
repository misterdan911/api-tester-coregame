const config = require('config');
const mg = require('../lib/mongo-helper');
const agendaModel = require('../models/agenda');

const { dataForDelete } = require('../data-dummy/grupParaControllerTest');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

let url = config.backendUrl;
var expect = chai.expect;
var assert = chai.assert;
var theToken = "";


//Our parent block
describe('GrupParaControllerTest', () => {

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
      .get(`/grup-para`)
      .catch(err => { throw err; });
    expect(res).to.have.status(401);
  });

  describe('Wrap of all test', () => {

    describe('DELETE /grup-para/:id - Delete Grup Para', () => {

      beforeEach(async () => {
        await dataForDelete.prepareData();
      });
      afterEach(async () => {
        await dataForDelete.cleanData();
      });

      it(`Cannot delete Grup Para if it's still used on active surat`, async () => {
        const res = await chai.request(url)
          .delete(`/grup-para/${dataForDelete.grupParaData._id}`)
          .set({ "Authorization": `Bearer ${theToken}` })
          .catch(err => { throw err; });
        expect(res).to.have.status(400);
      });

      it(`Should delete Grup Para by ID`, async () => {
        await agendaModel.findOneAndUpdate({ _id: dataForDelete.agendaData._id }, { $set: { status: 'FINAL' } }, { new: true }).catch(err => { throw err });
        const res = await chai.request(url)
          .delete(`/grup-para/${dataForDelete.grupParaData._id}`)
          .set({ "Authorization": `Bearer ${theToken}` })
          .catch(err => { throw err; });
        expect(res).to.have.status(200);
      });


    });

  });

});