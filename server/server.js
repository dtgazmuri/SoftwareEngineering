const express = require("express");
const db = require("./db");
const app = express();

const Telegraf = require("telegraf");
const bot = new Telegraf("5043150571:AAEbpKvmC8TdJjSX-7GuQ-hmvGeHWk_khUc");

const server = require("./app")(app, db, undefined, bot);
const port = 3001;

bot.launch();
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
