const config = require('config');
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

async function storePoint(theToken, gameId, tokenId, arrRewardAndPoint) {

  let data = {
    game_id: gameId,
    msisdn: config.msisdn,
    item: arrRewardAndPoint,
    token_id: tokenId,
    type: 'life'
  };

  // console.log('XXX Data', data);

  res = await chai.request(config.backendUrl)
    .post(`/api/v1/arcade/storePoint`)
    .set({ "Authorization": `bearer ${theToken}` })
    .send(data)
    .catch(err => { throw err; });

  // console.log('XXX Data', data);
  // console.log('XXX RES', res.body);

  return res.body;
}

module.exports = storePoint;
