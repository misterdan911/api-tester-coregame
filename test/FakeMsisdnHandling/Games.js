const config = require('config');
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

const decrypt = require('./Decryptor');
let decryptMethod = 'AES-256-CBC';
let decryptSecretKey = 'Bismillah';

async function games(theToken) {
  res = await chai.request(config.backendUrl)
    .get(`/api/v1/games`)
    .set({ "Authorization": `bearer ${theToken}` })
    .catch(err => { throw err; });

  encData = res.body.payload;
  // console.log(res.body);

  res = await decrypt(encData, decryptMethod, decryptSecretKey);
  res = JSON.parse(res.text);

  return res;
}

module.exports = games;
