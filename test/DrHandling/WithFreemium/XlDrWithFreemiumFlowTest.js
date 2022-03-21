const config = require('config');

let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
const assert = chai.assert;
// const expect = chai.expect;

const resetMsisdn = require('../helper/ResetMsisdnRealAndFake');
const activateFreemium = require('../helper/ActivateFreemium');
const modifyFreemiumMsisdnDateToBeExpired = require('../helper/ModifyFreemiumMsisdnDateToBeExpired');
const drParam = require('../../helper/DrParam');
const dbPantura = require('../../../lib/mysql-helper-db1');


const msisdnData = {
  realMsisdn: 6285956240495,
  realMsisdnCrc32: null,
  fakeMsisdn: 735218214,
  fakeMsisdnCrc32: null
};

const getSubscriptionStatus = require('../helper/GetSubscriptionStatus');
const getPointAndSoal = require('../helper/GetPointAndSoal');
const QuizSimulator = require('../../helper/QuizSimulator');


describe('XlDrWithFreemiumFlowTest', function () {

  this.timeout('15s');

  beforeEach(async () => {
    await resetMsisdn(msisdnData);
    await activateFreemium('xl');
  });


  it('Scenario XlDrWithFreemiumFlowTest', async function () {
    console.log('-- Testing Begin --');

    let res;
    let status;
    let currentPoin = 0;
    let currentSoalQuota = 0;

    console.log('Login ke App...');
    // -------------------------------------------------------
    res = await chai.request(config.backendUrl)
      .post('/register')
      .send({ msisdn: msisdnData.realMsisdn })
      .catch(err => { throw err; });

    assert.equal(res.body.code, 200);

    currentPoin += parseInt(10);
    currentSoalQuota += parseInt(99999);

    status = await getSubscriptionStatus(msisdnData.realMsisdn);
    assert.equal(status, 1);

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
      chosenAnswerType: 'random',
      stopAtTotalPlay: 15
    });

    let playData = await quizSimulator.run();

    currentPoin += parseInt(playData.totalPoin);
    currentSoalQuota -= parseInt(playData.totalPlay);

    poinAndSoal = await getPointAndSoal(msisdnData.realMsisdn);
    assert.equal(poinAndSoal.poin, currentPoin);
    assert.equal(poinAndSoal.soal, currentSoalQuota);

    console.log('totalPlay:', playData.totalPlay);
    console.log('totalRightAnswer:', playData.totalRightAnswer);
    console.log('totalQuizPoin:', playData.totalPoin);

    console.log(`Subscription Status: ${status}, Poin: ${poinAndSoal.poin}, Soal: ${poinAndSoal.soal}`);
    // -------------------------------------------------------


    console.log('Set Freemium date to expired...');
    // -------------------------------------------------------
    modifyFreemiumMsisdnDateToBeExpired(msisdnData);


    console.log('Coba main quiz lagi...');
    // -------------------------------------------------------
    quizSimulator = new QuizSimulator();
    quizSimulator.setConfig({
      msisdn: msisdnData.realMsisdn,
      chosenAnswerType: 'random',
      stopAtTotalPlay: 15
    });

    playData = await quizSimulator.run();

    currentPoin += parseInt(playData.totalPoin);
    currentSoalQuota = 0;

    poinAndSoal = await getPointAndSoal(msisdnData.realMsisdn);
    assert.equal(poinAndSoal.poin, currentPoin);
    assert.equal(poinAndSoal.soal, currentSoalQuota);

    console.log('totalPlay:', playData.totalPlay);
    console.log('totalRightAnswer:', playData.totalRightAnswer);
    console.log('totalQuizPoin:', playData.totalPoin);
    
    console.log(`Subscription Status: ${status}, Poin: ${poinAndSoal.poin}, Soal: ${poinAndSoal.soal}`);
    // -------------------------------------------------------
    /*
    */



    assert.equal('OK', 'OK');

  });


});


// Object.prototype.toString.call(x) === "[object String]"
