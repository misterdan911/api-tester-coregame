const config = require('config');
const mysql = require("mysql");

class Database1 {
  constructor() {
    this.connection = mysql.createPool({
      host: config.db1.host,
      user: config.db1.user,
      password: config.db1.password,
      database: config.db1.dbName,
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

module.exports = new Database1();
