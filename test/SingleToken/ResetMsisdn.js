const mysql = require('../../lib/mysql-helper');

async function resetMsisdn(data) {
    const realMsisdn = data.realMsisdn;
    const realMsisdnCrc32 = data.realMsisdnCrc32;
    const fakeMsisdn = data.fakeMsisdn;
    const fakeMsisdnCrc32 = data.fakeMsisdnCrc32;

    let q = '';

    q = `DELETE FROM dr WHERE msisdn = ${realMsisdn} OR msisdn = ${fakeMsisdn}`;
    await mysql.query(q);

    q = `DELETE FROM fake_msisdn WHERE real_msisdn = ${realMsisdn} OR fake_msisdn = ${fakeMsisdn}`;
    await mysql.query(q);

    q = `DELETE FROM players WHERE msisdn = ${realMsisdn} OR fake_id = ${realMsisdnCrc32} OR msisdn = ${fakeMsisdn} OR msisdn = ${fakeMsisdnCrc32}`;
    await mysql.query(q);

    q = `DELETE FROM leaderboard WHERE msisdn = ${realMsisdn} OR msisdn = ${fakeMsisdn}`;
    await mysql.query(q);

    q = `DELETE FROM loyalti_points WHERE msisdn = ${realMsisdn} OR msisdn = ${fakeMsisdn}`;
    await mysql.query(q);

    q = `DELETE FROM rewards WHERE msisdn = ${realMsisdn}`;
    await mysql.query(q);

    q = `DELETE FROM subscriptions WHERE msisdn = ${realMsisdn} OR msisdn = ${fakeMsisdn}`;
    await mysql.query(q);

    q = `DELETE FROM games WHERE fake_id = ${realMsisdnCrc32}`;
    await mysql.query(q);

    q = `DELETE FROM points WHERE fake_id = ${realMsisdnCrc32}`;
    await mysql.query(q);

    q = `DELETE FROM token_session WHERE fake_id = ${realMsisdnCrc32} OR fake_id = ${fakeMsisdnCrc32}`;
    await mysql.query(q);

    q = `DELETE FROM life_session WHERE fake_id = ${realMsisdnCrc32} OR fake_id = ${fakeMsisdnCrc32}`;
    await mysql.query(q);

    q = `DELETE FROM player_apps WHERE fake_id = ${realMsisdnCrc32} OR fake_id = ${fakeMsisdnCrc32}`;
    await mysql.query(q);

    q = `DELETE FROM player_inbox WHERE msisdn = ${realMsisdn} OR msisdn = ${fakeMsisdn}`;
    await mysql.query(q);
}

module.exports = resetMsisdn;
