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

//getting all the farmerOrders with farmer info
exports.getFarmerOrders = (db) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT O.id AS id, farmerId, state, total, datetime, NAME, SURNAME FROM farmerorder O INNER JOIN farmer F ON O.farmerId = F.id";
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const orders = rows.map((e) => ({
        id: e.id,
        farmerid: e.farmerId, 
        state: e.state,
        total: e.total,
        datetime: e.datetime,
        name: e.NAME,
        surname: e.SURNAME,
      }));
      resolve(orders);
    });
  });
};

exports.getFarmerOrderItems= (db, orderid) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT PRODUCT, QUANTITY, NAME AS PRODUCTNAME , F.PRICE as PRICE FROM farmerorderitems F INNER JOIN product P ON F.PRODUCT = P.id WHERE orderid = ?";
    db.all(sql, [orderid], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const products = rows.map((e) => ({
        id: e.PRODUCT,
        quantity: e.QUANTITY,
        name: e.PRODUCTNAME,
        price: e.PRICE,
      }));
      resolve(products);
    });
  });

};