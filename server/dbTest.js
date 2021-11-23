"use strict";
const sqlite = require("sqlite3");

const dbTest = new sqlite.Database("testDB.db", (error) => {
  if (error) throw error;
});

module.exports = dbTest;
