const config = require('config');
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

async function getPointAndSoal(msisdn) {

  let res = await chai.request(config.backendUrl)
    .post('/checkPoin')
    .send({
      msisdn: msisdn
    })
    .catch(err => { throw err; });

  let data = {
    poin: res.body.data[0].poin,
    soal: res.body.data[0].soal,
  };

  return data;
}

module.exports = getPointAndSoal;
