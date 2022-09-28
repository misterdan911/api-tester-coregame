const config = require('config');

let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
const assert = chai.assert;

const db = require('../../../lib/mysql-helper');
const msisdnData = require('./MsisdnData');

function getNowDate() {
  var d = new Date(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear(),
    hour = '' + (d.getHours()),
    minute = '' + (d.getMinutes()),
    second = '' + (d.getSeconds());

  var nowDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

  return nowDate;
}

var Dr = {
  requestPushUt2AllNumber: async function () {

    let drParam = '';
    let trxId = 5352894758;

    for (let i = 0; msisdnData.length > i; i++) {

      trxId = trxId + 1;
      let msisdn = msisdnData[i].msisdn;
      let nowDate = getNowDate();

      drParam = `trx_id=${trxId}&op_id=2&keyword=REG UT2&msisdn=${msisdn}&adn=92366&date=${nowDate}&status=SUCCESS&subject=MT;PUSH;SMS;TEXT&subscribed=1`;
      console.log(drParam);

      res = await chai.request(config.backendUrl)
        .post('/api/v1/dr?' + drParam)
        .catch(err => { throw err; });
      
    }

  }
};

module.exports = Dr;
