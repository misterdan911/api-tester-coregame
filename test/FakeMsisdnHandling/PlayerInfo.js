const config = require('config');
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

async function playerInfo(data) {
  res = await chai.request(config.backendUrl)
    .post(`/api/v1/playerInfo`)
    .send({
        keyword: data.keyword,
        msisdn: data.msisdn,
        service: data.service,
      })
      .catch(err => { throw err; });

  return res.body;
}

module.exports = playerInfo;
