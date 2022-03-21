const config = require('config');
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

async function getSubscriptionStatus(msisdn) {

  let res = await chai.request(config.backendUrl)
    .post('/checkSubscribe')
    .send({
      msisdn: msisdn
    })
    .catch(err => { throw err; });


  return res.body.data[0].status;
}

module.exports = getSubscriptionStatus;
