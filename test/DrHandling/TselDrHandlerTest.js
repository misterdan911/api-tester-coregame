const config = require('config');

let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
const assert = chai.assert;
// const expect = chai.expect;

const resetMsisdn = require('./helper/ResetMsisdn');
const deactivateFreemium = require('./helper/DeactivateFreemium');
const dbPantura = require('../../lib/mysql-helper-db1');


const msisdnData = {
  realMsisdn: 6281292218946,
  realMsisdnCrc32: 1604179042,
  fakeMsisdn: null,
  fakeMsisdnCrc32: null
};

const getSubscriptionStatus = require('./helper/GetSubscriptionStatus');
const getPointAndSoal = require('./helper/GetPointAndSoal');
const QuizSimulator = require('../helper/QuizSimulator');


describe('TselDrHandlerTest', function () {

  this.timeout('15s');

  beforeEach(async () => {
    await resetMsisdn(msisdnData);
    await deactivateFreemium();
  });


  it('Scenario TselDrHandlerTest', async function () {
    console.log('-- Testing Begin --');

    let res;
    let status;
    let currentPoin = 0;
    let currentSoalQuota = 0;

    console.log('Register lewat WAP...');
    // -------------------------------------------------------
    let q = `INSERT INTO simulate_sdp_registered_msisdn (msisdn) VALUES (${msisdnData.realMsisdn})`;
    let row = await dbPantura.query(q);
    assert.equal(row.affectedRows, 1);
    // -------------------------------------------------------



    console.log('Login ke App...');
    // -------------------------------------------------------
    res = await chai.request(config.backendUrl)
      .post('/register')
      .send( {msisdn: msisdnData.realMsisdn} )
      .catch(err => { throw err; });

    assert.equal(res.body.code, 200);

    status = await getSubscriptionStatus(msisdnData.realMsisdn);
    assert.equal(status, 1);

    poinAndSoal = await getPointAndSoal(msisdnData.realMsisdn);
    currentPoin += parseInt(10);
    currentSoalQuota += parseInt(config.soal_kuota_reg);

    assert.equal(poinAndSoal.poin, currentPoin);
    assert.equal(poinAndSoal.soal, currentSoalQuota);
    
    console.log(`Subscription Status: ${status}, Poin: ${poinAndSoal.poin}, Soal: ${poinAndSoal.soal}`);
    // -------------------------------------------------------
    
    
    
    console.log('Main Quiz...');
    // -------------------------------------------------------
    let quizSimulator = new QuizSimulator();
    quizSimulator.setConfig({
      msisdn: msisdnData.realMsisdn,
      chosenAnswerType: 'random'
    });

    let playData = await quizSimulator.run();
    
    currentPoin += parseInt(playData.totalPoin);
    currentSoalQuota -= parseInt(playData.totalPlay);

    console.log('totalPlay:', playData.totalPlay);
    console.log('totalRightAnswer:', playData.totalRightAnswer);
    console.log('totalQuizPoin:', playData.totalPoin);

    poinAndSoal = await getPointAndSoal(msisdnData.realMsisdn);
    assert.equal(poinAndSoal.poin, currentPoin);
    assert.equal(poinAndSoal.soal, currentSoalQuota);

    console.log(`Subscription Status: ${status}, Poin: ${poinAndSoal.poin}, Soal: ${poinAndSoal.soal}`);
    // -------------------------------------------------------



    console.log('UNREG...');
    // -------------------------------------------------------
    q = `DELETE FROM simulate_sdp_registered_msisdn WHERE msisdn = ${msisdnData.realMsisdn}`;
    row = await dbPantura.query(q);
    assert.equal(row.affectedRows, 1);

    status = await getSubscriptionStatus(msisdnData.realMsisdn);
    assert.equal(status, 0);

    currentPoin = parseInt(0);
    currentSoalQuota = parseInt(0);

    poinAndSoal = await getPointAndSoal(msisdnData.realMsisdn);
    assert.equal(poinAndSoal.poin, currentPoin);
    assert.equal(poinAndSoal.soal, currentSoalQuota);

    console.log(`Subscription Status: ${status}, Poin: ${poinAndSoal.poin}, Soal: ${poinAndSoal.soal}`);
    // -------------------------------------------------------


    console.log('re-Register lewat WAP...');
    // -------------------------------------------------------
    q = `INSERT INTO simulate_sdp_registered_msisdn (msisdn) VALUES (${msisdnData.realMsisdn})`;
    row = await dbPantura.query(q);
    assert.equal(row.affectedRows, 1);
    // -------------------------------------------------------



    console.log('Login ke App...');
    // -------------------------------------------------------
    res = await chai.request(config.backendUrl)
      .post('/register')
      .send( {msisdn: msisdnData.realMsisdn} )
      .catch(err => { throw err; });

    assert.equal(res.body.code, 200);

    currentPoin = parseInt(10);
    currentSoalQuota += parseInt(config.soal_kuota_reg);

    status = await getSubscriptionStatus(msisdnData.realMsisdn);
    assert.equal(status, 1);

    poinAndSoal = await getPointAndSoal(msisdnData.realMsisdn);
    assert.equal(poinAndSoal.poin, currentPoin);
    assert.equal(poinAndSoal.soal, currentSoalQuota);

    console.log(`Subscription Status: ${status}, Poin: ${poinAndSoal.poin}, Soal: ${poinAndSoal.soal}`);
    // -------------------------------------------------------
    /*
    */



    assert.equal('OK', 'OK');

  });


});


// Object.prototype.toString.call(x) === "[object String]"
