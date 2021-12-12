"use strict";
// const db = require("../db");
const bcrypt = require("bcrypt");

exports.checkIfUserNotExists = (db, username) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE USERNAME = ?";
    db.get(sql, [username], (err, row) => {
      if (err) reject({ code: 500, msg: err });
      else if (row === undefined) resolve();
      else {
        reject({ code: 409, msg: "user already exits." });
      }
    });
  });
};

exports.addNewUser = (db, user, role) => {
  return new Promise((resolve, reject) => {
    var sql = "";
    var data = [];
    console.log(role);
    if (role == "customer") {
      sql = "INSERT INTO customer(NAME, SURNAME, WALLET) VALUES (?, ? ,?)";
      data = [user.name, user.surname, 0];
    } else if (role == "shopemployee") {
      sql = "INSERT INTO shopemployee(NAME,SURNAME) VALUES (?, ?)";
      data = [user.name, user.surname];
    }
    db.run(sql, data, function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  })
    .then((userId) => {
      console.log("hereee");
      const saltRounds = 10;
      bcrypt.hash(user.password, saltRounds, function (err, hash) {
        return new Promise((resolve, reject) => {
          const sql =
            "INSERT INTO users(USERID, USERNAME, HASH, ROLE) VALUES (?, ? , ? , ?)";
          db.run(sql, [userId, user.username, hash, role], function (err) {
            if (err) {
              console.log("errorrrr");
              reject(err);
              return;
            }
            resolve(userId);
          });
        });
      });
    })
    .catch((err) => {
      reject(err);
    });
};
