"use strict";
const db = require("./db");

exports.getCustomerByUserId = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM customer WHERE ID = ?";
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      if (rows.length == 0 || rows == undefined) {
        reject({ code: "404", msg: "not found" });
      } else {
        resolve(rows);
      }
    });
  });
};
