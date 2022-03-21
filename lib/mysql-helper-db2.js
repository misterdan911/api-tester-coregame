const config = require('config');
const mysql = require("mysql");

class Database2 {
  constructor() {
    this.connection = mysql.createPool({
      host: config.db2.host,
      user: config.db2.user,
      password: config.db2.password,
      database: config.db2.dbName,
      multipleStatements: true
    });
  }

  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, rows) => {
        if (err)
          return reject(err);
        resolve(rows);
      });
    });
  }

}

module.exports = new Database2();
