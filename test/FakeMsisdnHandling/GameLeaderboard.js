const config = require('config');
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

const decrypt = require('./Decryptor');
let decryptMethod = 'AES-256-CBC';
let decryptSecretKey = 'Bismillah';

async function gameLeaderboard(theToken) {
  res = await chai.request(config.backendUrl)
    .post(`/api/v1/gameLeaderboard`)
    .set({ "Authorization": `bearer ${theToken}` })
    .catch(err => { throw err; });

  encData = res.body.payload;

  res = await decrypt(encData, decryptMethod, decryptSecretKey);
  res = JSON.parse(res.text);

  return res;
}

module.exports = gameLeaderboard;
