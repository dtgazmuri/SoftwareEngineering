/* This file contain the SQL query for the DB for the farmer requests */

//const sqlite = require("sqlite3");

// open the database
/*
const db = new sqlite.Database('se2.db', (err) => {
  if(err) throw err;
});
*/

//get the list of all the products of a specific farmer
exports.getFarmerProducts = (db, farmerId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM product WHERE FARMER = ?";
    db.all(sql, [farmerId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const products = rows.map((e) => ({
        id: e.ID,
        name: e.NAME,
        price: e.PRICE,
      }));
      resolve(products);
    });
  });
};

//putting the expected availability for a specific product
exports.addProductExpectedAmount = (db, product) => {
  return new Promise((resolve, reject) => {
    //replace can insert if not present or update
    const sql = "REPLACE INTO warehouse VALUES (?, ?)";
    db.run(sql, [product.product, product.quantity], (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(product);
    });
  });
};
