const db = require('./mysql-helper');

const dataSeeder = {

  populateCp: async () => {
    const cp_insert = `INSERT INTO content_provider VALUES (1,'sbi','Sinergi Bestama Indonesia','2020-08-10 11:44:10','2020-08-10 11:44:10'),(2,'iam','Infinity Air Media','2020-08-10 11:44:10','2020-08-10 11:44:10'),(3,'aman','Aman Devloop Indonesia','2020-08-10 11:44:10','2020-08-10 11:44:10'),(4,'tigamacam','Tiga Macan Multimedia','2020-08-10 11:44:10','2020-08-10 11:44:10'),(5,'ulatbulu','Ulat Bulu Bersama','2020-08-10 11:44:10','2020-08-10 11:44:10'),(6,'dkt','DKT','2020-08-10 11:44:10','2020-08-10 11:44:10');`;
    await db.query(cp_insert);
  },

  populateApplication: async () => {
    const cp_insert = `INSERT INTO applications VALUES (1,'mvicall','Mvicall',1,'eyJhcHBfYWxpYXMiOiJtdmljYWxsIiwiYXBwX25hbWUiOiJNdmljYWxsIiwiY3BfaWQiOjF9bWvpLVR51y9ubIRlDdMHpwyAbpAa',NULL,NULL,'2020-08-10 11:44:10','2020-08-10 11:44:10'),(2,'funquiz','FunQuiz',1,'eyJhcHBfYWxpYXMiOiJmdW5xdWl6IiwiYXBwX25hbWUiOiJGdW5RdWl6IiwiY3BfaWQiOjF9mV42EYI5XqZHkMstJyTMDA8OY1GB',NULL,NULL,'2020-08-10 11:44:10','2020-08-10 11:44:10'),(3,'utenggo','Ular Tenggo',1,'eyJhcHBfYWxpYXMiOiJ1dGVuZ2dvIiwiYXBwX25hbWUiOiJVbGFyIFRlbmdnbyIsImNwX2lkIjoxfQ==aGeWlvxnnXLxKA7fMKH1',NULL,NULL,'2020-08-10 11:44:10','2020-08-10 11:44:10'),(4,'ptr','Pantura',2,'eyJhcHBfYWxpYXMiOiJwdHIiLCJhcHBfbmFtZSI6IlBhbnR1cmEiLCJjcF9pZCI6Mn0=HrzTISUBWa5G3Xz1UukAlf0K7va4SWwJ',NULL,NULL,'2020-08-10 11:44:10','2020-08-10 11:44:10'),(5,'judgeme','JudgeMe',3,'eyJhcHBfYWxpYXMiOiJqdWRnZW1lIiwiYXBwX25hbWUiOiJKdWRnZU1lIiwiY3BfaWQiOjN9akLYxVzjfprTR1horWXHpCi361JL',NULL,NULL,'2020-08-10 11:44:10','2020-08-10 11:44:10'),(6,'balaphoki','Balap Hoki',4,'eyJhcHBfYWxpYXMiOiJiYWxhcGhva2kiLCJhcHBfbmFtZSI6IkJhbGFwIEhva2kiLCJjcF9pZCI6NH0=XJv9ZWNPfvv7eQOqIPt9',NULL,NULL,'2020-08-10 11:44:10','2020-08-10 11:44:10'),(7,'ketokoo','KeTokoo',2,'eyJhcHBfYWxpYXMiOiJrZXRva29vIiwiYXBwX25hbWUiOiJLZVRva29vIiwiY3BfaWQiOjJ9ZsFBrBkfneCVzCgjUWyH26rnrpwb',NULL,NULL,'2020-10-14 11:14:05','2020-10-14 11:14:05'),(8,'portalHutch','Portal Hutch',5,'eyJhcHBfYWxpYXMiOiJwb3J0YWxIdXRjaCIsImFwcF9uYW1lIjoiUG9ydGFsIEh1dGNoIiwiY3BfaWQiOjV900VGCKcuCgn9q0UR',NULL,NULL,'2021-03-08 03:46:09','2021-03-08 03:46:09'),(9,'serbahoki','Serba Hoki',5,'eyJhcHBfYWxpYXMiOiJwb3J0YWxIdXRjaCIsImFwcF9uYW1lIjoiUG9ydGFsIEh1dGNoIiwiY3BfaWQiOjV9pNNpr46aKHSUOS4T',NULL,NULL,'2021-04-23 02:54:56','2021-04-23 02:54:56');`;
    await db.query(cp_insert);
  },

  populateBanner1row: async () => {
    const sqlInsert = `INSERT INTO banners (id, app_id, telco_id, name, description, url, media, status, created_at, updated_at) VALUES (1, 13, 2, 'Pesta Reward', 'Loremssss ipsum dolor sit amet.', 'leaderboard', 'banner/13_2/media_1.jpeg', 1, '2021-07-23 02:50:22', '2021-07-23 02:50:22');`;
    await db.query(sqlInsert);
  },

  populateBanner6row: async () => {
    const sqlInsert = `INSERT INTO banners (id, app_id, telco_id, name, description, url, media, status, created_at, updated_at) VALUES (1, 13, 2, 'Pesta Reward', 'Loremssss ipsum dolor sit amet.', 'leaderboard', 'banner/13_2/media_1.jpeg', 1, '2021-07-23 02:50:22', '2021-07-23 02:50:22'), (2, 13, 2, 'Hadiah Langsung', 'Consectetur adipiscing elit.', 'home', 'banner/13_2/media_2.png', 1, '2021-07-23 11:03:33', '2021-07-23 11:03:33'), (3, 13, 2, 'Pesta Reward', 'Convallis velit arcu et sit lacinia id.', 'redeem', 'banner/13_2/media_3.png', 1, '2021-07-23 11:03:33', '2021-07-23 11:03:33'), (4, 13, 4, 'Pesta Reward', 'Loremssss ipsum dolor sit amet.', 'leaderboard', 'banner/13_2/media_1.jpeg', 1, '2021-07-23 02:50:22', '2021-07-23 02:50:22'), (5, 13, 4, 'Hadiah Langsung', 'Consectetur adipiscing elit.', 'home', 'banner/13_2/media_2.png', 1, '2021-07-23 11:03:33', '2021-07-23 11:03:33'), (6, 13, 4, 'Pesta Reward', 'Convallis velit arcu et sit lacinia id.', 'redeem', 'banner/13_2/media_3.png', 1, '2021-07-23 11:03:33', '2021-07-23 11:03:33');`;
    await db.query(sqlInsert);
  }

  
}

module.exports = dataSeeder;