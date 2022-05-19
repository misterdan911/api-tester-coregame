const config = require('config');
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

async function storePoint(theToken, gameId, tokenId) {
  res = await chai.request(config.backendUrl)
    .post(`/api/v1/arcade/storePoint`)
    .set({ "Authorization": `bearer ${theToken}` })
    .send({
        game_id: gameId,
        msisdn: config.msisdn,
        item: [
            {
                reward: 'ut_game',
                point: 10
            },
            {
                reward: 'ut_samsung',
                point: 1
            }
        ],
        token_id: tokenId,
        type: 'life'
    })
    .catch(err => { throw err; });

  return res.body;
}

module.exports = storePoint;
