const config = require('config');
const bent = require('bent');

let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
const assert = chai.assert;
const expect = chai.expect;

const singleToken = require('../../lib/singleToken');
const resetMsisdn = require('./ResetMsisdn');
const drParam = require('./DrParam');

const getProfile = require('./GetProfile');
const getLifeSession = require('./GetLifeSession');
const getGameId = require('./GetGameId');
const startGame = require('./StartGame');
const storePoint = require('./StorePoint');

describe('FakeMsisdnHandlingTest', function () {

  this.timeout('60s');

  beforeEach(async () => {
    // Reset msisdn data
    // -----------------------------
    let data = {
      realMsisdn: 6281937506111,
      realMsisdnCrc32: 864692149,
      fakeMsisdn: 845659416,
      fakeMsisdnCrc32: 2490898972
    };

    await resetMsisdn(data);
    // -----------------------------
  });


  it('Fake MSISDN Scenario 1: Start with REG from sms', async function () {
    console.log('-- Testing scenario 1 --');

    // REG from sms
    // -------------------------------------------------------
    console.log('REG from sms...');
    let post = bent(config.backendUrl, 'POST', 'string', 200, 500);
    let response = await post('/api/v1/dr?' + drParam.push);
    assert.equal(response, 'success');
    // -------------------------------------------------------

    let theToken;
    let res;

    // Login into Game
    // -------------------------------------------------------
    console.log('Login into Game...');

    theToken = await singleToken.generate();
    expect(theToken).to.be.a('String');

    res = await getProfile(theToken);
    assert.equal(res.life, 3);

    console.log(`Point: ${res.point}, Life: ${res.life}`);
    // -------------------------------------------------------

    console.log('Start playing game...');

    // getLifeSession
    // -------------------------------------------------------
    theToken = await singleToken.generate();
    res = await getLifeSession(theToken);
    assert.equal(res.msisdn, config.msisdn);
    // -------------------------------------------------------

    let lifeId = res.life_id;

    // startGame
    // -------------------------------------------------------
    theToken = await singleToken.generate();
    let gameId = getGameId();
    res = await startGame(theToken, gameId, lifeId);
    assert.equal(res.data.game_id, gameId);
    // -------------------------------------------------------

    // storePoint
    // -------------------------------------------------------
    theToken = await singleToken.generate();
    res = await storePoint(theToken, gameId, lifeId);
    assert.equal(res.error_message, 'success storePoint');
    // -------------------------------------------------------

    console.log('Finished playing game...');
    
    // Verified current point and life
    // -------------------------------------
    theToken = await singleToken.generate();
    res = await getProfile(theToken);
    assert.equal(res.life, 2);
    assert.equal(res.point, 11);

    console.log(`Point: ${res.point}, Life: ${res.life}`);
    // -------------------------------------

    // Abisin Nyawa
    // ---------------------------------------------------
    let restLife = res.life;

    for (let i=0; restLife > i; i++ ) {
      theToken = await singleToken.generate();
      res = await getLifeSession(theToken);
      lifeId = res.life_id;
  
      theToken = await singleToken.generate();
      gameId = getGameId();
      await startGame(theToken, gameId, lifeId);
    }

    console.log(`Using up the rest of life without getting any point...`);
    // ---------------------------------------------------

    // Verified current life
    // -------------------------------------
    theToken = await singleToken.generate();
    res = await getProfile(theToken);
    assert.equal(res.life, 0);
    assert.equal(res.point, 11);

    console.log(`Point: ${res.point}, Life: ${res.life}`);
    // -------------------------------------

    // PULL from sms
    // -------------------------------------------------------
    console.log('PULL from sms');

    post = bent(config.backendUrl, 'POST', 'string', 200, 500);
    response = await post('/api/v1/dr?' + drParam.pull);
    assert.equal(response, 'success');
    // -------------------------------------------------------

    // Verified current life
    // -------------------------------------
    theToken = await singleToken.generate();
    res = await getProfile(theToken);
    assert.equal(res.life, 3);
    assert.equal(res.point, 21);

    console.log(`Point: ${res.point}, Life: ${res.life}`);
    // -------------------------------------

  });

  it('Fake MSISDN Scenario 2: Start with Playing Game', async function () {
    console.log('-- Testing scenario 2 --');

    let post;
    let response;
    let theToken;
    let res;

    // Login ke Game
    // -------------------------------------------------------
    console.log('Login into Game...');

    theToken = await singleToken.generate();
    expect(theToken).to.be.a('String');

    res = await getProfile(theToken);
    assert.equal(res.life, 3);

    console.log(`Point: ${res.point}, Life: ${res.life}`);
    // -------------------------------------------------------

    console.log('Start playing game...');

    // getLifeSession
    // -------------------------------------------------------
    theToken = await singleToken.generate();
    res = await getLifeSession(theToken);
    assert.equal(res.msisdn, config.msisdn);
    // -------------------------------------------------------

    let lifeId = res.life_id;

    // startGame
    // -------------------------------------------------------
    theToken = await singleToken.generate();
    let gameId = getGameId();
    res = await startGame(theToken, gameId, lifeId);
    assert.equal(res.data.game_id, gameId);
    // -------------------------------------------------------

    // storePoint
    // -------------------------------------------------------
    theToken = await singleToken.generate();
    res = await storePoint(theToken, gameId, lifeId);
    assert.equal(res.error_message, 'success storePoint');
    // -------------------------------------------------------
    
    console.log('Finished playing game...');

    // Verified current point and life
    // -------------------------------------
    theToken = await singleToken.generate();
    res = await getProfile(theToken);
    assert.equal(res.life, 2);
    assert.equal(res.point, 11);

    console.log(`Point: ${res.point}, Life: ${res.life}`);
    // -------------------------------------

    // Abisin Nyawa
    // ---------------------------------------------------
    theToken = await singleToken.generate();
    res = await getLifeSession(theToken);
    lifeId = res.life_id;

    theToken = await singleToken.generate();
    gameId = getGameId();
    await startGame(theToken, gameId, lifeId);

    theToken = await singleToken.generate();
    res = await getLifeSession(theToken);
    lifeId = res.life_id;

    theToken = await singleToken.generate();
    gameId = getGameId();
    await startGame(theToken, gameId, lifeId);

    console.log(`Using up the rest of life without getting any point...`);
    // ---------------------------------------------------

    // Verified current life
    // -------------------------------------
    theToken = await singleToken.generate();
    res = await getProfile(theToken);
    assert.equal(res.life, 0);
    assert.equal(res.point, 11);

    console.log(`Point: ${res.point}, Life: ${res.life}`);
    // -------------------------------------

    // PULL from sms
    // -------------------------------------------------------
    console.log('PULL from sms');

    post = bent(config.backendUrl, 'POST', 'string', 200, 500);
    response = await post('/api/v1/dr?' + drParam.pull);
    assert.equal(response, 'success');
    // -------------------------------------------------------

    // Verified current life
    // -------------------------------------
    theToken = await singleToken.generate();
    res = await getProfile(theToken);
    assert.equal(res.life, 3);
    assert.equal(res.point, 11);

    console.log(`Point: ${res.point}, Life: ${res.life}`);
    // -------------------------------------

    // Abisin Nyawa
    // ---------------------------------------------------
    let restLife = res.life;

    for (let i=0; restLife > i; i++ ) {
      theToken = await singleToken.generate();
      res = await getLifeSession(theToken);
      lifeId = res.life_id;
  
      theToken = await singleToken.generate();
      gameId = getGameId();
      await startGame(theToken, gameId, lifeId);
    }

    console.log(`Using up the rest of life without getting any point...`);
    // ---------------------------------------------------

    // Verified current life
    // -------------------------------------
    theToken = await singleToken.generate();
    res = await getProfile(theToken);
    assert.equal(res.life, 0);
    assert.equal(res.point, 11);

    console.log(`Point: ${res.point}, Life: ${res.life}`);
    // -------------------------------------


    // REG from sms
    // -------------------------------------------------------
    console.log('REG from sms');

    post = bent(config.backendUrl, 'POST', 'string', 200, 500);
    response = await post('/api/v1/dr?' + drParam.push);
    assert.equal(response, 'success');
    // -------------------------------------------------------

    // Verified current life
    // -------------------------------------
    theToken = await singleToken.generate();
    res = await getProfile(theToken);
    assert.equal(res.life, 3);
    assert.equal(res.point, 21);

    console.log(`Point: ${res.point}, Life: ${res.life}`);
    // -------------------------------------


  });

});


// Object.prototype.toString.call(x) === "[object String]"
