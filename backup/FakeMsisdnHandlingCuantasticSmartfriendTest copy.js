const config = require('config');
const appKey = require('../lib/appKey');

const bent = require('bent');

let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
const assert = chai.assert;
const expect = chai.expect;

const singleToken = require('../lib/singleToken');
const resetMsisdn = require('../test/FakeMsisdnHandling/ResetMsisdn');
const drParam = require('../test/FakeMsisdnHandling/DrParam');

const getProfile = require('../test/FakeMsisdnHandling/GetProfile');
const gameDetail = require('../test/FakeMsisdnHandling/GameDetail');
const getLifeSession = require('../test/FakeMsisdnHandling/GetLifeSession');
const getGameId = require('../test/FakeMsisdnHandling/GetGameId');
const startGame = require('../test/FakeMsisdnHandling/StartGame');
const storePoint = require('../test/FakeMsisdnHandling/StorePoint');

// Portal API
const gameProfile = require('../test/FakeMsisdnHandling/GameProfile');
const games = require('../test/FakeMsisdnHandling/Games');
const gameLeaderboard = require('../test/FakeMsisdnHandling/GameLeaderboard');


const msisdnData = {
  realMsisdn: 62882291246819,
  realMsisdnCrc32: 3861036268,
  fakeMsisdn: 2892884890,
  fakeMsisdnCrc32: 3138368731
};

const arrRewardAndPoint = [
  {
    reward: 'Coin',
    point: 10
  }
];

describe('FakeMsisdnHandlingCuantasticSmartfriendTest', function () {

  this.timeout('120s');

  beforeEach(async () => {
    // Reset msisdn data on all related table
    await resetMsisdn(msisdnData);
  });

  it('Fake MSISDN Scenario 1: Start with REG from sms', async function () {
    console.log('-- Testing scenario 1 --');

    // Receiving DR From Messaging
    // -------------------------------------------------------
    console.log('Receiving DR From Messaging...');
    let post = bent(config.backendUrl, 'POST', 'string', 200, 500);
    let response = await post('/api/v1/dr?' + drParam.smart.push);
    assert.equal(response, 'success');
    // -------------------------------------------------------

    let theToken;
    let res;

    // Login into Game
    // -------------------------------------------------------
    console.log('Login into Portal...');

    theToken = await singleToken.generate(appKey.cuantastic, msisdnData.realMsisdn);
    expect(theToken).to.be.a('String');

    res = await gameProfile(theToken);
    assert.equal(res.msisdn, msisdnData.realMsisdn);

    console.log('Hitting gameDetail API..');
    theToken = await singleToken.generate(appKey.cuantastic, msisdnData.realMsisdn);
    expect(theToken).to.be.a('String');

    res = await gameDetail(theToken);
    assert.equal(res.token, 1);
    assert.equal(res.point, null);
    console.log(`Point: ${res.point}, Life: ${res.token}`);
    // -------------------------------------------------------

    console.log('Start playing game...');

    // getLifeSession
    // -------------------------------------------------------
    theToken = await singleToken.generate(appKey.cuantastic, msisdnData.realMsisdn);
    res = await getLifeSession(theToken);
    assert.equal(res.msisdn, msisdnData.realMsisdn);
    // -------------------------------------------------------

    let lifeId = res.life_id;

    // startGame
    // -------------------------------------------------------
    theToken = await singleToken.generate(appKey.cuantastic, msisdnData.realMsisdn);
    let gameId = getGameId();
    res = await startGame(theToken, gameId, lifeId);
    assert.equal(res.data.game_id, gameId);
    // -------------------------------------------------------

    // storePoint
    // -------------------------------------------------------
    theToken = await singleToken.generate(appKey.cuantastic, msisdnData.realMsisdn);
    res = await storePoint(theToken, gameId, lifeId, arrRewardAndPoint);
    assert.equal(res.error_message, 'success storePoint');
    // -------------------------------------------------------

    console.log('Finished playing game...');

    // Verified current point and life
    // -------------------------------------
    theToken = await singleToken.generate(appKey.cuantastic, msisdnData.realMsisdn);
    res = await getProfile(theToken);
    assert.equal(res.life, 0);
    assert.equal(res.point, 10);

    console.log(`Point: ${res.point}, Life: ${res.life}`);
    // -------------------------------------

    // Abisin Nyawa
    // ---------------------------------------------------
    let restLife = res.life;

    for (let i = 0; restLife > i; i++) {
      theToken = await singleToken.generate(appKey.cuantastic, msisdnData.realMsisdn);
      res = await getLifeSession(theToken);
      lifeId = res.life_id;

      theToken = await singleToken.generate(appKey.cuantastic, msisdnData.realMsisdn);
      gameId = getGameId();
      await startGame(theToken, gameId, lifeId);
    }

    console.log(`Using up the rest of life without getting any point...`);
    // ---------------------------------------------------

    // Verified current life
    // -------------------------------------
    theToken = await singleToken.generate(appKey.cuantastic, msisdnData.realMsisdn);
    res = await getProfile(theToken);
    assert.equal(res.life, 0);
    assert.equal(res.point, 10);

    console.log(`Point: ${res.point}, Life: ${res.life}`);
    // -------------------------------------

    // PULL from sms
    // -------------------------------------------------------
    console.log('PULL from sms');

    post = bent(config.backendUrl, 'POST', 'string', 200, 500);
    response = await post('/api/v1/dr?' + drParam.smart.pull);
    assert.equal(response, 'success');
    // -------------------------------------------------------

    // Verified current life
    // -------------------------------------
    theToken = await singleToken.generate(appKey.cuantastic, msisdnData.realMsisdn);
    res = await getProfile(theToken);
    assert.equal(res.life, 1);
    assert.equal(res.point, 20);  // Dapat tambahan loyalti point setelah msisdn matching dengan fake_msisdn

    console.log(`Point: ${res.point}, Life: ${res.life}`);
    // -------------------------------------

  });

  it('Can run api from login to leaderboard', async function () {
    console.log('-- It can run all api from login to leaderboard --');

    console.log('Hitting gameProfile API...');

    theToken = await singleToken.generate(appKey.cuantastic, msisdnData.realMsisdn);
    expect(theToken).to.be.a('String');

    res = await gameProfile(theToken);
    assert.equal(res.msisdn, msisdnData.realMsisdn);

    console.log('Hitting gameDetail API..');
    theToken = await singleToken.generate(appKey.cuantastic, msisdnData.realMsisdn);
    expect(theToken).to.be.a('String');

    res = await gameDetail(theToken);
    assert.equal(res.token, 1);
    assert.equal(res.point, null);

    console.log('Hitting games API..');
    theToken = await singleToken.generate(appKey.cuantastic, msisdnData.realMsisdn);
    expect(theToken).to.be.a('String');

    res = await games(theToken);
    expect(res).to.be.an('array')

    console.log('Hitting gameLeaderboard API..');
    theToken = await singleToken.generate(appKey.cuantastic, msisdnData.realMsisdn);
    expect(theToken).to.be.a('String');

    res = await gameLeaderboard(theToken);
    expect(res).to.be.an('array')


  });


  /*
  it('Fake MSISDN Scenario 2: Start with Playing Game', async function () {
    console.log('-- Testing scenario 2 --');

    let post;
    let response;
    let theToken;
    let res;

    // Login ke Game
    // -------------------------------------------------------
    console.log('Login into Game...');

    theToken = await singleToken.generate(appKey.cuantastic, msisdnData.realMsisdn);
    expect(theToken).to.be.a('String');

    res = await getProfile(theToken);
    assert.equal(res.life, 1);

    console.log(`Point: ${res.point}, Life: ${res.life}`);
    // -------------------------------------------------------

    console.log('Start playing game...');

    // getLifeSession
    // -------------------------------------------------------
    theToken = await singleToken.generate(appKey.cuantastic, msisdnData.realMsisdn);
    res = await getLifeSession(theToken);
    assert.equal(res.msisdn, msisdnData.realMsisdn);
    // -------------------------------------------------------

    let lifeId = res.life_id;

    // startGame
    // -------------------------------------------------------
    theToken = await singleToken.generate(appKey.cuantastic, msisdnData.realMsisdn);
    let gameId = getGameId();
    res = await startGame(theToken, gameId, lifeId, );
    assert.equal(res.data.game_id, gameId);
    // -------------------------------------------------------

    // storePoint
    // -------------------------------------------------------
    theToken = await singleToken.generate(appKey.cuantastic, msisdnData.realMsisdn);
    res = await storePoint(theToken, gameId, lifeId, arrRewardAndPoint);
    assert.equal(res.error_message, 'success storePoint');
    // -------------------------------------------------------

    console.log('Finished playing game...');

    // Verified current point and life
    // -------------------------------------
    theToken = await singleToken.generate(appKey.cuantastic, msisdnData.realMsisdn);
    res = await getProfile(theToken);
    assert.equal(res.life, 0);
    assert.equal(res.point, 10);

    console.log(`Point: ${res.point}, Life: ${res.life}`);
    // -------------------------------------

    // Abisin Nyawa
    // ---------------------------------------------------
    theToken = await singleToken.generate(appKey.cuantastic, msisdnData.realMsisdn);
    res = await getLifeSession(theToken);
    lifeId = res.life_id;

    theToken = await singleToken.generate(appKey.cuantastic, msisdnData.realMsisdn);
    gameId = getGameId();
    await startGame(theToken, gameId, lifeId);

    theToken = await singleToken.generate(appKey.cuantastic, msisdnData.realMsisdn);
    res = await getLifeSession(theToken);
    lifeId = res.life_id;

    theToken = await singleToken.generate(appKey.cuantastic, msisdnData.realMsisdn);
    gameId = getGameId();
    await startGame(theToken, gameId, lifeId);

    console.log(`Using up the rest of life without getting any point...`);
    // ---------------------------------------------------

    // Verified current life
    // -------------------------------------
    theToken = await singleToken.generate(appKey.cuantastic, msisdnData.realMsisdn);
    res = await getProfile(theToken);
    assert.equal(res.life, 0);
    assert.equal(res.point, 10);

    console.log(`Point: ${res.point}, Life: ${res.life}`);
    // -------------------------------------

    // PULL from sms
    // -------------------------------------------------------
    console.log('PULL from sms');

    post = bent(config.backendUrl, 'POST', 'string', 200, 500);
    response = await post('/api/v1/dr?' + drParam.smart.pull);
    assert.equal(response, 'success');
    // -------------------------------------------------------

    // Verified current life
    // -------------------------------------
    theToken = await singleToken.generate(appKey.cuantastic, msisdnData.realMsisdn);
    res = await getProfile(theToken);
    assert.equal(res.life, 1);
    assert.equal(res.point, 10);

    console.log(`Point: ${res.point}, Life: ${res.life}`);
    // -------------------------------------

    // Abisin Nyawa
    // ---------------------------------------------------
    let restLife = res.life;

    for (let i = 0; restLife > i; i++) {
      theToken = await singleToken.generate(appKey.cuantastic, msisdnData.realMsisdn);
      res = await getLifeSession(theToken);
      lifeId = res.life_id;

      theToken = await singleToken.generate(appKey.cuantastic, msisdnData.realMsisdn);
      gameId = getGameId();
      await startGame(theToken, gameId, lifeId);
    }

    console.log(`Using up the rest of life without getting any point...`);
    // ---------------------------------------------------

    // Verified current life
    // -------------------------------------
    theToken = await singleToken.generate(appKey.cuantastic, msisdnData.realMsisdn);
    res = await getProfile(theToken);
    assert.equal(res.life, 0);
    assert.equal(res.point, 10);

    console.log(`Point: ${res.point}, Life: ${res.life}`);
    // -------------------------------------


    // REG from sms
    // -------------------------------------------------------
    console.log('REG from sms');

    post = bent(config.backendUrl, 'POST', 'string', 200, 500);
    response = await post('/api/v1/dr?' + drParam.smart.push);
    assert.equal(response, 'success');
    // -------------------------------------------------------

    // Verified current life
    // -------------------------------------
    theToken = await singleToken.generate(appKey.cuantastic, msisdnData.realMsisdn);
    res = await getProfile(theToken);
    assert.equal(res.life, 1);
    assert.equal(res.point, 20);

    console.log(`Point: ${res.point}, Life: ${res.life}`);
    // -------------------------------------


  });
  */

});


// Object.prototype.toString.call(x) === "[object String]"
