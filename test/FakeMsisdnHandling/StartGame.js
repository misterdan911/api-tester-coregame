const config = require('config');
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

async function startGame(theToken, gameId, tokenId) {
  res = await chai.request(config.backendUrl)
    .post(`/api/v1/arcade/startGame`)
    .set({ "Authorization": `bearer ${theToken}` })
    .send({
      game_id: gameId,
      token_id: tokenId
    })
    .catch(err => { throw err; });

  return res.body;
}

module.exports = startGame;
