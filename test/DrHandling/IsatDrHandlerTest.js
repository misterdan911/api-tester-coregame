const config = require('config');

let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
const assert = chai.assert;
// const expect = chai.expect;

const resetMsisdn = require('./helper/ResetMsisdn');
const deactivateFreemium = require('./helper/DeactivateFreemium');
const drParam = require('../helper/DrParam');
const QuizSimulator = require('../helper/QuizSimulator');
const getSubscriptionStatus = require('./helper/GetSubscriptionStatus');
const getPointAndSoal = require('./helper/GetPointAndSoal');

const msisdnData = {
  realMsisdn: 6285781777802,
  realMsisdnCrc32: 76428347,
  fakeMsisdn: null,
  fakeMsisdnCrc32: null
};


describe('IsatDrHandlerTest', function () {

  this.timeout('15s');

  beforeEach(async () => {
    await resetMsisdn(msisdnData);
    await deactivateFreemium();
  });

  it('Scenario 1: Start with REG from sms', async function () {
    console.log('-- Testing scenario 1 --');

    let res;
    let status;
    let currentPoin = 0;
    let currentSoalQuota = 0;

    console.log('REG from sms...');
    // -------------------------------------------------------
    res = await chai.request(config.backendUrl)
      .get('/Getfakeidpantura?' + drParam.isat.push)
      .catch(err => { throw err; });

    assert.equal(res.text, 'OK');

    currentPoin += parseInt(10);    
    currentSoalQuota += 99999;

    status = await getSubscriptionStatus(msisdnData.realMsisdn);
    assert.equal(status, 1);

    poinAndSoal = await getPointAndSoal(msisdnData.realMsisdn);
    assert.equal(poinAndSoal.poin, currentPoin);
    assert.equal(poinAndSoal.soal, currentSoalQuota);

    console.log(`Subscription Status: ${status}, Poin: ${poinAndSoal.poin}, Soal: ${poinAndSoal.soal}`);
    // -------------------------------------------------------


    console.log('Login from App...');
    // -------------------------------------------------------
    res = await chai.request(config.backendUrl)
      .post('/register')
      .send( {msisdn: msisdnData.realMsisdn} )
      .catch(err => { throw err; });

    assert.equal(res.body.code, 200);
    // -------------------------------------------------------



    console.log('Main Quiz...');
    // -------------------------------------------------------
    let quizSimulator = new QuizSimulator();

    quizSimulator.setConfig({
      msisdn: msisdnData.realMsisdn,
      chosenAnswerType: 'random',
      stopAtTotalPlay: 15
    });

    let playData = await quizSimulator.run();

    console.log('totalPlay:', playData.totalPlay);
    console.log('totalRightAnswer:', playData.totalRightAnswer);
    console.log('totalQuizPoin:', playData.totalPoin);

    currentPoin += parseInt(playData.totalPoin);
    currentSoalQuota -= parseInt(playData.totalPlay);

    poinAndSoal = await getPointAndSoal(msisdnData.realMsisdn);
    assert.equal(poinAndSoal.poin, currentPoin);
    assert.equal(poinAndSoal.soal, currentSoalQuota);

    console.log(`Subscription Status: ${status}, Poin: ${poinAndSoal.poin}, Soal: ${poinAndSoal.soal}`);
    // -------------------------------------------------------


    console.log('PULL from sms...');
    // -------------------------------------------------------
    res = await chai.request(config.backendUrl)
      .get('/Getfakeidpantura?' + drParam.isat.pull)
      .catch(err => { throw err; });

    assert.equal(res.text, 'OK');
    currentSoalQuota += parseInt(99999);

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
      chosenAnswerType: 'random',
      stopAtTotalPlay: 15
    });

    playData = await quizSimulator.run();

    console.log('totalPlay:', playData.totalPlay);
    console.log('totalRightAnswer:', playData.totalRightAnswer);
    console.log('totalQuizPoin:', playData.totalPoin);

    currentPoin += parseInt(playData.totalPoin);
    currentSoalQuota -= parseInt(playData.totalPlay);

    poinAndSoal = await getPointAndSoal(msisdnData.realMsisdn);
    assert.equal(poinAndSoal.poin, currentPoin);
    assert.equal(poinAndSoal.soal, currentSoalQuota);

    console.log(`Subscription Status: ${status}, Poin: ${poinAndSoal.poin}, Soal: ${poinAndSoal.soal}`);
    // -------------------------------------------------------


    console.log('Daily PUSH...');
    // -------------------------------------------------------
    res = await chai.request(config.backendUrl)
      .get('/Getfakeidpantura?' + drParam.isat.push)
      .catch(err => { throw err; });

    assert.equal(res.text, 'OK');

    currentPoin += parseInt(10);
    currentSoalQuota += parseInt(99999);

    status = await getSubscriptionStatus(msisdnData.realMsisdn);
    assert.equal(status, 1);

    poinAndSoal = await getPointAndSoal(msisdnData.realMsisdn);
    assert.equal(poinAndSoal.poin, currentPoin);
    assert.equal(poinAndSoal.soal, currentSoalQuota);

    console.log(`Subscription Status: ${status}, Poin: ${poinAndSoal.poin}, Soal: ${poinAndSoal.soal}`);
    // -------------------------------------------------------


    console.log('UNREG from sms...');
    // -------------------------------------------------------
    res = await chai.request(config.backendUrl)
      .get('/Getfakeidpantura?' + drParam.isat.unreg)
      .catch(err => { throw err; });

    assert.equal(res.text, 'OK');

    currentPoin = 0
    currentSoalQuota = 0;

    status = await getSubscriptionStatus(msisdnData.realMsisdn);
    assert.equal(status, 0);

    poinAndSoal = await getPointAndSoal(msisdnData.realMsisdn);
    assert.equal(poinAndSoal.poin, currentPoin);
    assert.equal(poinAndSoal.soal, currentSoalQuota);

    console.log(`Subscription Status: ${status}, Poin: ${poinAndSoal.poin}, Soal: ${poinAndSoal.soal}`);
    // -------------------------------------------------------


    console.log('re-REG from sms...');
    // -------------------------------------------------------
    res = await chai.request(config.backendUrl)
      .get('/Getfakeidpantura?' + drParam.isat.push)
      .catch(err => { throw err; });

    assert.equal(res.text, 'OK');

    currentPoin = parseInt(10);
    currentSoalQuota = 99999;

    status = await getSubscriptionStatus(msisdnData.realMsisdn);
    assert.equal(status, 1);

    poinAndSoal = await getPointAndSoal(msisdnData.realMsisdn);
    assert.equal(poinAndSoal.poin, 10);
    assert.equal(poinAndSoal.soal, currentSoalQuota);

    console.log(`Subscription Status: ${status}, Poin: ${poinAndSoal.poin}, Soal: ${poinAndSoal.soal}`);
    // -------------------------------------------------------
    /*
    */


    assert.equal('OK', 'OK');

  });

  /*
  it('Scenario 2: Start with Login from App', async function () {
    console.log('-- Testing scenario 2 --');

    let res;
    let status;


    console.log('Login from App...');
    // ----------------------------------------------------------
    res = await chai.request(config.backendUrl)
      .post('/register')
      .send( {msisdn: msisdnData.realMsisdn} )
      .catch(err => { throw err; });

    assert.equal(res.body.code, 200);

    status = await getSubscriptionStatus(msisdnData.realMsisdn);

    if (panturaConfig.freemium == true) {
      assert.equal(status, 1);
    }
    else {
      assert.equal(status, '');
    }

    poinAndSoal = await getPointAndSoal(msisdnData.realMsisdn);
    assert.equal(poinAndSoal.poin, 0);
    assert.equal(poinAndSoal.soal, 99999);

    console.log(`Subscription Status: ${status}, Poin: ${poinAndSoal.poin}, Soal: ${poinAndSoal.soal}`);
    // ----------------------------------------------------------



    // Main Quiz
    // -------------------------------------------------------
    console.log('Main Quiz...');

    let quizSimulator = new QuizSimulator();

    quizSimulator.setConfig({
      msisdn: msisdnData.realMsisdn,
      chosenAnswerType: 'always_true',
      stopAtTotalPlay: 15
    });

    let totalPlay = await quizSimulator.run();
    console.log('totalPlay:', totalPlay);

    poinAndSoal = await getPointAndSoal(msisdnData.realMsisdn);
    assert.equal(poinAndSoal.poin, 150);
    assert.equal(poinAndSoal.soal, 99984);

    console.log(`Subscription Status: ${status}, Poin: ${poinAndSoal.poin}, Soal: ${poinAndSoal.soal}`);
    // -------------------------------------------------------

    // PULL from sms
    // -------------------------------------------------------
    console.log('PULL from sms...');

    res = await chai.request(config.backendUrl)
      .get('/Getfakeidpantura?' + drParam.isat.pull)
      .catch(err => { throw err; });

    assert.equal(res.text, 'OK');

    status = await getSubscriptionStatus(msisdnData.realMsisdn);
    assert.equal(status, 1);

    poinAndSoal = await getPointAndSoal(msisdnData.realMsisdn);
    assert.equal(poinAndSoal.poin, 160);
    assert.equal(poinAndSoal.soal, 99987);

    console.log(`Subscription Status: ${status}, Poin: ${poinAndSoal.poin}, Soal: ${poinAndSoal.soal}`);
    // -------------------------------------------------------

    // Daily PUSH
    // -------------------------------------------------------
    console.log('Daily PUSH...');

    res = await chai.request(config.backendUrl)
      .get('/Getfakeidpantura?' + drParam.isat.push)
      .catch(err => { throw err; });

    assert.equal(res.text, 'OK');

    status = await getSubscriptionStatus(msisdnData.realMsisdn);
    assert.equal(status, 1);

    poinAndSoal = await getPointAndSoal(msisdnData.realMsisdn);
    assert.equal(poinAndSoal.poin, 170);
    assert.equal(poinAndSoal.soal, 99990);

    console.log(`Subscription Status: ${status}, Poin: ${poinAndSoal.poin}, Soal: ${poinAndSoal.soal}`);
    // -------------------------------------------------------


    // UNREG from sms
    // -------------------------------------------------------
    console.log('UNREG from sms...');

    res = await chai.request(config.backendUrl)
      .get('/Getfakeidpantura?' + drParam.isat.unreg)
      .catch(err => { throw err; });

    assert.equal(res.text, 'OK');

    status = await getSubscriptionStatus(msisdnData.realMsisdn);
    assert.equal(status, 0);

    poinAndSoal = await getPointAndSoal(msisdnData.realMsisdn);
    assert.equal(poinAndSoal.poin, 0);
    assert.equal(poinAndSoal.soal, 99990);

    console.log(`Subscription Status: ${status}, Poin: ${poinAndSoal.poin}, Soal: ${poinAndSoal.soal}`);
    // -------------------------------------------------------


    assert.equal('OK', 'OK');

  });
  */


});


// Object.prototype.toString.call(x) === "[object String]"
