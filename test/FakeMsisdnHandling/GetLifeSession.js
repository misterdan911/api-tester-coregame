const config = require('config');
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

const decrypt = require('./Decryptor');
let decryptMethod = 'BASE64';
let decryptSecretKey = '2r7GJQ49zfeG';

async function getLifeSession(theToken) {
  res = await chai.request(config.backendUrl)
    .post(`/api/v1/arcade/getLifeSession`)
    .set({ "Authorization": `bearer ${theToken}` })
    .catch(err => { throw err; });

  encData = res.body.data;

  res = await decrypt(encData, decryptMethod, decryptSecretKey);
  res = JSON.parse(res.text);

  return res;
}

module.exports = getLifeSession;
