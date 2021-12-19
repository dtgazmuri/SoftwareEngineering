"use strict";

// const db = require("../db");
const bcrypt = require("bcrypt");

exports.getUserById = (db, id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE id = ?";
    db.get(sql, [id], (err, row) => {
      if (err) reject(err);
      else if (row === undefined) resolve({ error: "Admin not found." });
      else {
        const user = {
          id: row.ID,
          username: row.USERNAME,
          role: row.ROLE,
          userid: row.USERID,
        };
        resolve(user);
      }
    });
  });
};
exports.getId = (db, id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT USERID FROM users WHERE USERNAME = ?";
    db.get(sql, [id], (err, row) => {
      if (err) reject(err);
        else if (row === undefined) reject({ error: "User not found." });
      else {
        const user = row.USERID
        resolve(user);
      }
    });
  });
};

exports.getUser = (db, username, password) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE USERNAME = ?";
    db.get(sql, [username], (err, row) => {
      if (err) reject(err);
      else if (row === undefined) {
        console.log(`username ${username}`);

        resolve(false);
      } else {
        const admin = {
          id: row.ID,
          username: row.USERNAME,
          role: row.ROLE,
          userid: row.USERID,
        };
        console.log(admin);
        bcrypt.compare(password, row.HASH).then((result) => {
          if (result) {
            //Verified
            resolve(admin);
          } //No match, wrong password
          else resolve(false);
        });
      }
    });
  });
};
