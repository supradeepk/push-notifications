class SubscriberTable {
  constructor(dao) {
    this.dao = dao;
    this.tableName = 'subscriber';
    this.createTable();
  }

  createTable() {
    const sql = `
        CREATE TABLE IF NOT EXISTS ${this.tableName} (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          endpoint TEXT)`;
    return this.dao.run(sql);
  }

  insertData(endpointData) {
    const sql = `INSERT INTO ${this.tableName} (endpoint)
          VALUES (?)`;
    return new Promise((resolve, reject) => {
      this.dao.run(sql, [endpointData], (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  all() {
    const sql = `SELECT endpoint from ${this.tableName}`;
    return new Promise((resolve) => {
      this.dao.all(sql, function (err, result) {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  }
}

module.exports = SubscriberTable;