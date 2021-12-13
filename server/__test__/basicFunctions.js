const db = require("../dbTest");

exports.deleteTable = (tableName) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM " + tableName;
    db.run(sql, [], (err) => {
      if (err) {
        reject(err);
        return;
      } else resolve();
    });
  });
};
exports.addCustomerForTest = (customer) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO customer(NAME, SURNAME, WALLET) VALUES (?, ? , ?)";
    db.run(
      sql,
      [customer.NAME, customer.SURNAME, customer.WALLET],
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);
      }
    );
  });
};

exports.addFarmerForTest = (farmer) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO farmer(NAME, SURNAME) VALUES (?, ?)";
    db.run(sql, [farmer.NAME, farmer.SURNAME], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

exports.addProductForTest = (product, farmerId) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO product(NAME, FARMER, PRICE) VALUES (?, ?, ?)";
    db.run(sql, [product.NAME, farmerId, product.PRICE], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

exports.addProductToWarehouse = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO warehouse(PRODUCT, QUANTITY) VALUES (?, ?)";
    db.run(sql, [id, 0], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};

exports.addUserForTest = (user, userId, hash, role) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO users(USERID, USERNAME, HASH, ROLE) VALUES (?, ? , ? , ?)";
    db.run(sql, [userId, user.username, hash, role], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

exports.addFarmerAndOrderForTest = (farmer, product) => {
  return new Promise((resolve, reject) => {
    const sql1 = "INSERT INTO farmer(NAME, SURNAME) VALUES (?, ?)";
    db.run(sql, [farmer.NAME, farmer.SURNAME], function (err) {
      if (err) {
        reject(err);
        return;
      }
      fid = this.lastID;
      const sql2 = "INSERT INTO product(NAME, FARMER, PRICE) VALUES(?, ?, ?)"
      db.run(sql2, [product.NAME, fid, product.PRICE], function (err) {
        if (err) {
          reject(err);
          return;
        }
        pid = this.lastID;
        const sql3 = "INSERT INTO farmerorderitems(ORDERID, PRODUCT, QUANTITY, PRICE) VALUES(?, ?, ?)"
        db.run(sql3, [0, pid, 1, 1], function (err) {
          if (err) {
            reject(err);
            return;
          }
          
          resolve();
        });
        resolve();
      });
      resolve();
    });
  });
};

exports.addOrderForTest = () => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO farmerorder(id, farmerid, state, datetime) VALUES (?, ? , ? , ?)";
    db.run(sql, [0, pending, "2021-12-01 12:00"], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};