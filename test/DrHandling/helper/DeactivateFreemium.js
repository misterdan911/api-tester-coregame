const db1 = require('../../../lib/mysql-helper-db1');

async function deactivateFreemium(data) {

    let arrQ;

    arrQ = [
        `UPDATE freemium_telco_config SET status = '0'`,
    ];

    for (let i = 0; arrQ.length > i; i++) {
        await db1.query(arrQ[i]);
    }

}

module.exports = deactivateFreemium;
