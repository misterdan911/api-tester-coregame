const config = require('config');
const appKey = require('../../lib/appKey');

const bent = require('bent');

let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
const assert = chai.assert;
const expect = chai.expect;

const resetMsisdn = require('./ResetMsisdn');
const singleToken = require('../../lib/singleToken');
const getProfile = require('./GetProfile');

const msisdnData = {
  realMsisdn: 6285781722737,
  realMsisdnCrc32: 2880154376,
  fakeMsisdn: 2641716754,
  fakeMsisdnCrc32: 1921452205
};


describe('SingleTokenTest', function () {

  this.timeout('60s');

  beforeEach(async () => {
    // Reset msisdn data on all related table
    await resetMsisdn(msisdnData);
  });

  it('Token can be generated and used correctly', async function () {

    let theToken;
    let res;

    // Generate Token
    // -------------------------------------------------------
    console.log('Generate Token...');

    theToken = await singleToken.generate(appKey.utenggo, msisdnData.realMsisdn);
    expect(theToken).to.be.a('String');
    // -------------------------------------------------------
    
    // getProfile
    // -------------------------------------------------------
    console.log('Get Profile...');
    res = await getProfile(theToken);
    assert.equal(res.life, 0);

    // console.log(`Point: ${res.point}, Life: ${res.life}`);
    // console.log(res);
    // -------------------------------------------------------

    // using fake_msisdn
    console.log('Get Token using fake_msisdn...');
    theToken = await singleToken.generate(appKey.utenggo, msisdnData.fakeMsisdn, 5);
    expect(theToken).to.be.a('String');
    
    console.log('Get Profile...');
    res = await getProfile(theToken);
    assert.equal(res.life, 0);

    // console.log(res);

  });


});


// Object.prototype.toString.call(x) === "[object String]"
