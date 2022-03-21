const config = require('config');

let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
const assert = chai.assert;

const resetMsisdn = require('./helper/ResetMsisdnRealAndFake');
const deactivateFreemium = require('./helper/DeactivateFreemium');
const drParam = require('../helper/DrParam');

const msisdnData = {
  realMsisdn: 6285956240495,
  realMsisdnCrc32: null,
  fakeMsisdn: 735218214,
  fakeMsisdnCrc32: null
};

const getSubscriptionStatus = require('./helper/GetSubscriptionStatus');
const getPointAndSoal = require('./helper/GetPointAndSoal');
const QuizSimulator = require('../helper/QuizSimulator');


describe('XlDrHandlerTest', function () {

  this.timeout('15s');

  beforeEach(async () => {
    await resetMsisdn(msisdnData);
    await deactivateFreemium();
  });


  it('Scenario 1: Start with REG from sms', async function () {
    console.log('-- Testing scenario 1: Start with REG from sms --');

    let res;
    let status;
    let currentPoin = 0;
    let currentSoalQuota = 0;

    console.log('REG from sms...');
    // -------------------------------------------------------
    res = await chai.request(config.backendUrl)
      .get('/Getfakeidpantura?' + drParam.xl.push)
      .catch(err => { throw err; });

    assert.equal(res.text, 'OK');

    poinAndSoal = await getPointAndSoal(msisdnData.realMsisdn);
    assert.equal(poinAndSoal.poin, currentPoin);
    assert.equal(poinAndSoal.soal, currentSoalQuota);

    console.log(`Poin: ${poinAndSoal.poin}, Soal: ${poinAndSoal.soal}`);
    // -------------------------------------------------------


    console.log('Login from App...');
    // -------------------------------------------------------

    res = await chai.request(config.backendUrl)
      .post('/register')
      .send({ msisdn: msisdnData.realMsisdn })
      .catch(err => { throw err; });

    assert.equal(res.body.data[0].phone, msisdnData.realMsisdn);

    status = await getSubscriptionStatus(msisdnData.realMsisdn);
    assert.equal(status, 1);

    currentPoin += parseInt(10);
    currentSoalQuota += parseInt(config.soal_kuota_reg);

    poinAndSoal = await getPointAndSoal(msisdnData.realMsisdn);
    
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
      // stopAtTotalPlay: 15
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
    


    console.log('PULL from sms...');
    // -------------------------------------------------------
    res = await chai.request(config.backendUrl)
      .get('/Getfakeidpantura?' + drParam.xl.pull)
      .catch(err => { throw err; });

    assert.equal(res.text, 'OK');

    currentSoalQuota += parseInt(config.soal_kuota_pull);

    status = await getSubscriptionStatus(msisdnData.realMsisdn);
    assert.equal(status, 1);

    poinAndSoal = await getPointAndSoal(msisdnData.realMsisdn);

    assert.equal(poinAndSoal.poin, currentPoin);
    assert.equal(poinAndSoal.soal, currentSoalQuota);



    console.log(`Subscription Status: ${status}, Poin: ${poinAndSoal.poin}, Soal: ${poinAndSoal.soal}`);
    // -------------------------------------------------------


    console.log('Main Quiz lagi...');
    // -------------------------------------------------------

    quizSimulator = new QuizSimulator();

    quizSimulator.setConfig({
      msisdn: msisdnData.realMsisdn,
      chosenAnswerType: 'random'
      // stopAtTotalPlay: 15
    });

    playData = await quizSimulator.run();

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


    // Daily PUSH
    // -------------------------------------------------------
    console.log('Daily PUSH...');

    res = await chai.request(config.backendUrl)
      .get('/Getfakeidpantura?' + drParam.xl.push)
      .catch(err => { throw err; });

    assert.equal(res.text, 'OK');

    currentPoin += parseInt(10);
    currentSoalQuota += parseInt(config.soal_kuota_reg);

    status = await getSubscriptionStatus(msisdnData.realMsisdn);
    assert.equal(status, 1);

    poinAndSoal = await getPointAndSoal(msisdnData.realMsisdn);

    assert.equal(poinAndSoal.poin, currentPoin);
    assert.equal(poinAndSoal.soal, currentSoalQuota);

    console.log(`Subscription Status: ${status}, Poin: ${poinAndSoal.poin}, Soal: ${poinAndSoal.soal}`);
    // -------------------------------------------------------


    // UNREG from sms
    // -------------------------------------------------------
    console.log('UNREG from sms...');

    res = await chai.request(config.backendUrl)
      .get('/Getfakeidpantura?' + drParam.xl.unreg)
      .catch(err => { throw err; });

    assert.equal(res.text, 'OK');

    currentPoin = 0;
    currentSoalQuota = 0

    status = await getSubscriptionStatus(msisdnData.realMsisdn);
    assert.equal(status, 0);

    poinAndSoal = await getPointAndSoal(msisdnData.realMsisdn);
    console.log(`Subscription Status: ${status}, Poin: ${poinAndSoal.poin}, Soal: ${poinAndSoal.soal}`);

    assert.equal(poinAndSoal.poin, currentPoin);
    assert.equal(poinAndSoal.soal, currentSoalQuota);
    // -------------------------------------------------------


    console.log('re-REG from sms...');
    // -------------------------------------------------------
    res = await chai.request(config.backendUrl)
      .get('/Getfakeidpantura?' + drParam.xl.push)
      .catch(err => { throw err; });

    assert.equal(res.text, 'OK');

    currentPoin += parseInt(10);
    currentSoalQuota += parseInt(config.soal_kuota_reg);

    poinAndSoal = await getPointAndSoal(msisdnData.realMsisdn);
    console.log(`Poin: ${poinAndSoal.poin}, Soal: ${poinAndSoal.soal}`);

    assert.equal(poinAndSoal.poin, currentPoin);
    assert.equal(poinAndSoal.soal, currentSoalQuota);
    // -------------------------------------------------------
    /*
    */

    assert.equal('OK', 'OK');
  });



});



