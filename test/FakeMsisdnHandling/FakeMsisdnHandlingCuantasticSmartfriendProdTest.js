const config = require('config');
const appKey = require('../../lib/appKey');

const bent = require('bent');

let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
const assert = chai.assert;
const expect = chai.expect;

const singleToken = require('../../lib/singleToken');
const resetMsisdn = require('./ResetMsisdn');
const drParam = require('./DrParam');

const playerInfo = require('./PlayerInfo');

const getProfile = require('./GetProfile');
const gameDetail = require('./GameDetail');
const getLifeSession = require('./GetLifeSession');
const getGameId = require('./GetGameId');
const startGame = require('./StartGame');
const storePoint = require('./StorePoint');

// Portal API
const gameProfile = require('./GameProfile');
const games = require('./Games');
const gameLeaderboard = require('./GameLeaderboard');

/*
const msisdnData = {
  realMsisdn: 62882291246819,
};
*/

const msisdnData = {
  realMsisdn: 1673917512,
  realMsisdnCrc32: 3522276225,
  fakeMsisdn: 3287532181,
  fakeMsisdnCrc32: 2070502234
};

const mno_id = 5;

const arrRewardAndPoint = [
  {
    reward: 'Coin',
    point: 10
  }
];

describe('FakeMsisdnHandlingCuantasticSmartfriendProdTest', function () {

  this.timeout('240s');

  beforeEach(async () => {
    // Reset msisdn data on all related table
    // console.log('Resetting msisdn data on all related table...');
    // await resetMsisdn(msisdnData);
  });

  it('Can run api from first sms push to leaderboard', async function () {
    console.log('-- It can run all api from dr to leaderboard --');

    let res;
    let data;

    // -------------------------------------------------------
    console.log('Receiving DR From Messaging...');
    let post = bent(config.backendUrl, 'POST', 'string', 200, 500);
    let response = await post('/api/v1/dr?' + drParam.smart.push);
    console.log(response);
    assert.equal(response, 'success');
    // -------------------------------------------------------
    console.log('Hitting playerInfo API...');
    data = {
      keyword: 'REG CUAN',
      msisdn: msisdnData.realMsisdn,
      service: 'CUAN_SMART',
    };
    res = await playerInfo(data);
    assert.equal(res.error_message, 'SUCCESS get Player Info');
    assert.equal(res.data.poin, 10);
    console.log(`Point: ${res.data.poin}`);
    // -------------------------------------------------------
    console.log('Hitting gameProfile API...');

    theToken = await singleToken.generate(appKey.cuantastic, msisdnData.realMsisdn, mno_id);
    expect(theToken).to.be.a('String');

    res = await gameProfile(theToken);
    assert.equal(res.msisdn, msisdnData.realMsisdn);
    // -------------------------------------------------------
    console.log('Hitting gameDetail API..');
    theToken = await singleToken.generate(appKey.cuantastic, msisdnData.realMsisdn, mno_id);
    expect(theToken).to.be.a('String');

    res = await gameDetail(theToken);
    assert.equal(res.token, 1);
    assert.equal(res.point, 10);
    // -------------------------------------------------------
    console.log('Hitting games API..');
    theToken = await singleToken.generate(appKey.cuantastic, msisdnData.realMsisdn, mno_id);
    expect(theToken).to.be.a('String');

    res = await games(theToken);
    expect(res).to.be.an('array')
    // -------------------------------------------------------
    console.log('Hitting gameLeaderboard API..');
    theToken = await singleToken.generate(appKey.cuantastic, msisdnData.realMsisdn, mno_id);
    expect(theToken).to.be.a('String');

    res = await gameLeaderboard(theToken);
    console.log(res);
    expect(res).to.be.an('array')
    // -------------------------------------------------------
  });

  it('Can run all gameplay api', async function () {
    console.log('-- Can run all gameplay api --');

    let res;
    let data;

    // -------------------------------------------------------
    console.log('Receiving DR From Messaging...');
    let post = bent(config.backendUrl, 'POST', 'string', 200, 500);
    let response = await post('/api/v1/dr?' + drParam.smart.push);
    assert.equal(response, 'success');
    // -------------------------------------------------------
    console.log('Hitting playerInfo API...');
    data = {
      keyword: 'REG CUAN',
      msisdn: msisdnData.realMsisdn,
      service: 'CUAN_SMART',
    };
    res = await playerInfo(data);
    assert.equal(res.error_message, 'SUCCESS get Player Info');
    assert.equal(res.data.poin, 10);
    console.log(`Point: ${res.data.poin}`);
    // -------------------------------------------------------
    console.log('Hitting getProfile API...');
    theToken = await singleToken.generate(appKey.cuantastic, msisdnData.realMsisdn, mno_id);
    expect(theToken).to.be.a('String');
    res = await getProfile(theToken);
    assert.equal(res.token, 1);
    console.log(`Point: ${res.point}, Life: ${res.life}`);
    // -------------------------------------------------------

    console.log('Start playing game...');

    // getLifeSession
    // -------------------------------------------------------
    theToken = await singleToken.generate(appKey.cuantastic, msisdnData.realMsisdn, mno_id);
    res = await getLifeSession(theToken);
    assert.equal(res.msisdn, msisdnData.realMsisdn);
    // -------------------------------------------------------

    let lifeId = res.life_id;

    // startGame
    // -------------------------------------------------------
    theToken = await singleToken.generate(appKey.cuantastic, msisdnData.realMsisdn, mno_id);
    let gameId = getGameId();
    res = await startGame(theToken, gameId, lifeId);
    assert.equal(res.data.game_id, gameId);
    // -------------------------------------------------------

    // storePoint
    // -------------------------------------------------------
    theToken = await singleToken.generate(appKey.cuantastic, msisdnData.realMsisdn, mno_id);
    res = await storePoint(theToken, gameId, lifeId, arrRewardAndPoint);
    assert.equal(res.error_message, 'success storePoint');
    // -------------------------------------------------------

    console.log('Finished playing game...');

    // Verified current point and life
    // -------------------------------------
    theToken = await singleToken.generate(appKey.cuantastic, msisdnData.realMsisdn, mno_id);
    res = await getProfile(theToken);
    assert.equal(res.life, 0);
    assert.equal(res.point, 20);

    console.log(`Point: ${res.point}, Life: ${res.life}`);
    // -------------------------------------

    // PULL from sms
    // -------------------------------------------------------
    console.log('PULL from sms...');

    post = bent(config.backendUrl, 'POST', 'string', 200, 500);
    response = await post('/api/v1/dr?' + drParam.smart.pull);
    assert.equal(response, 'success');
    // -------------------------------------------------------

    // Verified current life
    // -------------------------------------
    theToken = await singleToken.generate(appKey.cuantastic, msisdnData.realMsisdn, mno_id);
    res = await getProfile(theToken);
    assert.equal(res.life, 1);
    assert.equal(res.point, 20);

    console.log(`Point: ${res.point}, Life: ${res.life}`);
    // -------------------------------------------------------
    console.log('Simulate Daily push');

    post = bent(config.backendUrl, 'POST', 'string', 200, 500);
    response = await post('/api/v1/dr?' + drParam.smart.push);
    assert.equal(response, 'success');
    // -------------------------------------------------------

    // Verified current life
    // -------------------------------------
    theToken = await singleToken.generate(appKey.cuantastic, msisdnData.realMsisdn, mno_id);
    res = await getProfile(theToken);
    assert.equal(res.life, 2);
    assert.equal(res.point, 30);

    console.log(`Point: ${res.point}, Life: ${res.life}`);
    // -------------------------------------



  });


});


// Object.prototype.toString.call(x) === "[object String]"
