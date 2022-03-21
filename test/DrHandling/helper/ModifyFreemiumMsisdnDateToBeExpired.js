const db1 = require('../../../lib/mysql-helper-db1');

async function modifyFreemiumMsisdnDateToBeExpired(data) {

    const realMsisdn = data.realMsisdn;

    let arrQ;

    arrQ = [
        `UPDATE freemium SET start_date = DATE_SUB(start_date, INTERVAL 4 DAY), end_date = DATE_SUB(end_date, INTERVAL 4 DAY) WHERE msisdn = ${realMsisdn}`
    ];

    for (let i = 0; arrQ.length > i; i++) {
        await db1.query(arrQ[i]);
    }

}

module.exports = modifyFreemiumMsisdnDateToBeExpired;
