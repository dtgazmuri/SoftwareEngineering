const express = require("express");
const db = require("./db");
const app = express();

const server = require("./app")(app, db);
const port = 3001;

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
