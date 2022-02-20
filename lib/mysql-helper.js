const config = require('config');
const mysql = require("mysql");

class Database {
  constructor() {
    this.connection = mysql.createPool({
      host: config.db.host,
      user: config.db.user,
      password: config.db.password,
      database: config.db.dbName,
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

  async resetTable(tableName) {
    try {
      await this.query(`DELETE FROM ${tableName}`);
      await this.query(`ALTER TABLE ${tableName} AUTO_INCREMENT = 1`);
    } catch (err) {
      console.log('Reset Table Error:', err.sqlMessage);
    }
  }

}

module.exports = new Database();
