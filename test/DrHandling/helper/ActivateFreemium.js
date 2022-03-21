const db1 = require('../../../lib/mysql-helper-db1');

async function activateFreemium(mnoShortname) {

    let arrQ;

    arrQ = [
        `UPDATE freemium_telco_config SET status = '1' WHERE mno_shortname = '${mnoShortname}'`,
    ];

    for (let i = 0; arrQ.length > i; i++) {
        // console.log('Query:', arrQ[i]);
        await db1.query(arrQ[i]);
    }

}

module.exports = activateFreemium;
