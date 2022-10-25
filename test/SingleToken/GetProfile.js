const config = require('config');
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

const decrypt = require('./Decryptor');
let decryptMethod = 'BASE64';
let decryptSecretKey = '2r7GJQ49zfeG';

async function getProfile(theToken) {
  res = await chai.request(config.backendUrl)
    .post(`/api/v1/arcade/getProfile`)
    .set({ "Authorization": `bearer ${theToken}` })
    .catch(err => { throw err; });

  // console.log('xxx', res.body);
  encData = res.body.data;

  res = await decrypt(encData, decryptMethod, decryptSecretKey);
  // console.log('xxx', res.text);
  res = JSON.parse(res.text);

  return res;
}

module.exports = getProfile;
