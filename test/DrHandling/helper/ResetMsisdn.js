const db1 = require('../../../lib/mysql-helper-db1');
const db2 = require('../../../lib/mysql-helper-db2');

async function resetMsisdn(data) {
    const realMsisdn = data.realMsisdn;
    // const realMsisdnCrc32 = data.realMsisdnCrc32;
    // const fakeMsisdn = data.fakeMsisdn;
    // const fakeMsisdnCrc32 = data.fakeMsisdnCrc32;

    let arrQ;

    arrQ = [
        // `DELETE FROM tbl_temp_soal WHERE fake_id = ${realMsisdn}`,
        `DELETE FROM tbl_poin WHERE msisdn = ${realMsisdn}`,
        `DELETE FROM subscription WHERE msisdn = ${realMsisdn}`,
        `DELETE FROM \`profile\` WHERE phone = ${realMsisdn}`,
        `DELETE FROM tbl_historypoin WHERE msisdn = ${realMsisdn}`,
        `DELETE FROM tbl_leaderboard WHERE msisdn = ${realMsisdn}`,
        `DELETE FROM tbl_transact WHERE MSISDN = ${realMsisdn}`,
        `DELETE FROM simulate_sdp_registered_msisdn WHERE msisdn = ${realMsisdn}`,
        `DELETE FROM freemium WHERE msisdn = ${realMsisdn}`
    ];

    for (let i = 0; arrQ.length > i; i++) {
        // console.log(arrQ[i]);
        await db1.query(arrQ[i]);
    }

    arrQ = [
        `DELETE FROM user_transaction WHERE msisdn = ${realMsisdn}`
    ];

    for (let i = 0; arrQ.length > i; i++) {
        // console.log(arrQ[i]);
        await db2.query(arrQ[i]);
    }
}

module.exports = resetMsisdn;
