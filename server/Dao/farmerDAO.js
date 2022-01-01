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

//get the list of all the products of a specific farmer
exports.getFarmerProductsByName = (db, string) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT P.ID, P.NAME, P.PRICE FROM product P INNER JOIN farmer F ON P.FARMER = F.ID WHERE upper(F.NAME) = upper(?) OR upper(F.SURNAME) = upper(?)";
    db.all(sql, [string, string], (err, rows) => {
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

//getting the items inside the farmer order of id = orderid
exports.getFarmerOrderItems = (db, orderid) => {
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

//setting the state to delivered of farmer order of id = orderid
exports.ackDeliveryFarmerOrder = (db, orderid) => {
  return new Promise((resolve, reject) => {
    //first check if farmer order exists
    const sql = "SELECT * FROM farmerorder WHERE id = ?";
    db.all(sql, [orderid], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      else if (rows === undefined || rows.length === 0) {
        reject({ code: "404", msg: "FARMER ORDER NOT FOUND;" });
      }
      else {
        //try to update farmer order
        const sql1 = "UPDATE farmerorder SET state = 'delivered' WHERE id = ?";
        db.run(sql1, [orderid], (err) => {
          if (err) {
            reject(err);
            return;
          }
          else {
            const newOrder = { id: orderid, state: "delivered" };
            resolve(newOrder);
          }
        });
      }
    });
  });

};


//get farmer orders given the farmer id
exports.getFarmerOrderIds = (db, farmerId) => {
  return new Promise((resolve, reject) => {
    console.log("we");

    //NON e' farmerorderitems! e' orderitems!

    const sql = "SELECT DISTINCT ORDERID, STATE FROM orderitems FOI, product P, clientorder CO WHERE P.FARMER = ? AND P.ID = FOI.PRODUCT AND CO.ID = FOI.ORDERID";
    db.all(sql, [farmerId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      let list = [];
      for (let row of rows) {
        list.push({ id: row.ORDERID, status: row.STATE });
      }

      console.log(list);

      resolve(list);
    });
  });
};

//get order info given its id
exports.getOrdersInfo = (db, orderId, farmerId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT NAME, QUANTITY FROM orderitems O, product P WHERE P.FARMER = ? AND O.ORDERID = ? AND P.ID = O.PRODUCT";
    db.all(sql, [farmerId, orderId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      let list = [];
      for (let row of rows) {
        list.push({ name: row.NAME, quantity: row.QUANTITY });
      }
      resolve(list);
    });
  });
};

//update order status to confirmed given its id
exports.confirmOrder = (db, orderId) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE clientorder SET state = 'confirmed' WHERE id = ?";
    db.run(sql, [orderId], (err) => {
      if (err) {
        reject(err);
        return;
      }
      else {
        const order = { id: orderId, state: "confirmed" };
        resolve(order);
      }
    });
  });
};

//get username of customer given the id
exports.getCustomerMail = (db, oid) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT username FROM users U, clientorder CO WHERE U.ROLE LIKE 'customer' AND U.USERID = CO.CUSTOMER AND CO.ID = ?";
    db.all(sql, [oid], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows[0].username);
    });
  });
};