const db = require('../../../lib/mysql-helper');
const msisdnData = require('./MsisdnData');

async function ResetMsisdnData() {

    let arrQ;

    var concatenatedMsisdn = '';

    for (i=0; i<msisdnData.length; i++) {
        concatenatedMsisdn = concatenatedMsisdn + msisdnData[i].msisdn + ',';
    }

    concatenatedMsisdn = concatenatedMsisdn.slice(0, -1);

    // console.log(concatenatedMsisdn);

    arrQ = [
        `DELETE FROM dr WHERE msisdn IN (${concatenatedMsisdn})`
    ];

    for (let i = 0; arrQ.length > i; i++) {
        // console.log(arrQ[i]);
        await db.query(arrQ[i]);
    }
}

module.exports = ResetMsisdnData;
