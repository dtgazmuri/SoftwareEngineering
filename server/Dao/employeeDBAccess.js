/* This file contain the SQL query for the DB for the employee requests */

//const db = require("../db");

exports.getCustomers = (db) => {
  return new Promise((resolve, reject) => {
    //UPDATED query for getting customers in order to return also the username (email)
    const sql = "SELECT C.ID AS ID, NAME, SURNAME, WALLET, USERNAME FROM customer C INNER JOIN users U on C.id = U.USERID WHERE U.role = 'customer'";
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const customers = rows.map((e) => ({
        id: e.ID,
        name: e.NAME,
        surname: e.SURNAME,
        wallet: e.WALLET,
        username: e.USERNAME
      }));
      resolve(customers);
    });
  });
};

exports.getCustomerById = (db, id) => {
  return new Promise((resolve, reject) => {
    //UPDATED query for getting customers in order to return also the username (email)
    const sql = "SELECT USERNAME FROM users U WHERE U.ROLE = 'customer' AND U.USERID=?";
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if(row === undefined){
        reject({err: "undefined username"});
        return;
      }

      resolve(row.USERNAME);
    });
  });
};



// get all products (with the werehouse quantity)
exports.listProductsAll = (db) => {
  return new Promise((resolve, reject) => {
    //Create the sql query
    const sql =
      "SELECT ID, NAME, FARMER, PRICE, AVAILABILITY AS QUANTITY, QUANTITY AS AVAILABILITY FROM product P, warehouse W WHERE ID = PRODUCT";

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const products = rows.map((e) => ({
        id: e.ID,
        name: e.NAME,
        farmerid: e.FARMER,
        price: e.PRICE,
        quantity: e.QUANTITY,
        availability: e.AVAILABILITY
      }));
      resolve(products);
    });
  });
};

//Get the farmer info given its ID
exports.getFarmerById = (db, farmer_id) => {
  return new Promise((resolve, reject) => {
    //Create the sql query (the ? is for the farmer_id)
    const sql = "SELECT * FROM farmer WHERE ID = ?";

    //Excecute the query (pass the farmer_id as a parameter)
    db.all(sql, [farmer_id], (err, rows) => {
      //Check if any error occurs
      if (err) {
        //Reject the error to the caller
        reject(err);

        return;
      }

      //If not, map the answere on a SINGLE object
      const farmers = rows.map((e) => ({
        id: e.ID,
        name: e.NAME,
        surname: e.SURNAME,
      }));

      //Check the array length (it SHOULD be one)
      if (farmers.length == 1) {
        const farmer = farmers[0];

        //Return the new generated object
        resolve(farmer);
      } else {
        resolve({
          error: `the number of farmers returned with the given code is ${farmers.length} instead of 1`,
        });
      }
    });
  });
};

// get all orderitems of a given order ID
exports.getOrderItems = (db, order_id) => {
  return new Promise((resolve, reject) => {
    //Create the sql query
    const sql = "SELECT * FROM orderitems WHERE ORDERID = ?";

    //Excecute the query
    db.all(sql, [order_id], (err, rows) => {
      //Check if any error occurs
      if (err) {
        //Reject the error to the caller
        reject(err);

        return;
      }

      //If not, map the answere on a const array
      const items = rows.map((e) => ({
        id: e.ID,
        orderid: e.ORDERID,
        productid: e.PRODUCT,
        quantity: e.QUANTITY,
        price: e.PRICE,
      }));

      //Return the new generated array of objects
      resolve(items);
    });
  });
};

// get all the orders
exports.getOrderAll = (db) => {
  return new Promise((resolve, reject) => {
    //Create the sql query
    const sql = "SELECT * FROM clientorder";

    //Excecute the query
    db.all(sql, [], (err, rows) => {
      //Check if any error occurs
      if (err) {
        //Reject the error to the caller
        reject(err);

        return;
      }

      console.log("ci", rows)
      //If not, map the answere on a const array
      
      const orders = rows.map((e) => ({
        id: e.ID,
        username: e.USERNAME,
        customerid: e.CUSTOMER,
        state: e.STATE,
        delivery: e.DELIVERY,
        total: e.TOTAL,
      }));
      //Return the new generated array of objects
      resolve(orders);
    });
  });
};

exports.listCustomersAll = (db) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM customer";

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      const customers = rows.map((e) => ({
        id: e.ID,
        name: e.NAME,
        surname: e.SURNAME,
        username: e.USERNAME,
        hash: e.HASH,
        wallet: e.WALLET,
      }));
      resolve(customers);
    });
  });
};

exports.updateCustomerWallet = (db, id, value) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE customer SET WALLET = ? WHERE ID = ?";

    db.run(sql, [value, id], (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(id);
    });
  });
};

exports.handOutOrder = (db, id) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE clientorder SET STATE = ? WHERE ID = ?";

    db.run(sql, ["delivered", id], (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(id);
    });
  });
};

exports.lostOrderStatus = (db, id) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE clientorder SET STATE = ? WHERE ID = ?";

    db.run(sql, ["lost", id], (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(id);
    });
  });
};

// get all the orders
exports.getOrderAll = (db) => {
  return new Promise((resolve, reject) => {
    //Create the sql query
    const sql = "SELECT * FROM clientorder";

    //Excecute the query
    db.all(sql, [], (err, rows) => {
      //Check if any error occurs
      if (err) {
        //Reject the error to the caller
        reject(err);

        return;
      }

      //If not, map the answer on a const array
      const orders = rows.map((e) => ({
        id: e.ID,
        customerid: e.CUSTOMER,
        state: e.STATE,
        delivery: e.DELIVERY,
        total: e.TOTAL,
      }));

      //Return the new generated array of objects
      resolve(orders);
    });
  });
};

// get all the orders of a given customer
exports.getOrderByCustomer = (db, customer_id) => {
  return new Promise((resolve, reject) => {
    //Create the sql query
    const sql = "SELECT * FROM order WHERE CUSTOMER = ?";

    //Excecute the query
    db.all(sql, [customer_id], (err, rows) => {
      //Check if any error occurs
      if (err) {
        //Reject the error to the caller
        reject(err);

        return;
      }

      //If not, map the answer on a const array
      const orders = rows.map((e) => ({
        id: e.ID,
        customerid: e.CUSTOMER,
        state: e.STATE,
        delivery: e.DELIVERY,
        total: e.TOTAL,
      }));

      //Return the new generated array of objects
      resolve(orders);
    });
  });
};

//Add a new client order
exports.createClientOrder = (db, order) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO clientorder(CUSTOMER, STATE, DELIVERY, TOTAL, DATETIME, ADDRESS) VALUES(?, ?, ?, ?, ?, ?)";
    console.log(order.date);
    db.run(
      sql,
      [order.customerid, order.state, order.delivery, order.total, order.date, order.address],
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

//Add a new order item
exports.createOrderItem = (db, item) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO orderitems(ORDERID, PRODUCT, QUANTITY, PRICE) VALUES(?, ?, ?, ?)";

    db.run(
      sql,
      [item.orderid, item.productid, item.quantity, item.price],
      function (err) {
        if (err) {
          console.log(err);
          reject(err);
          return;
        }
        resolve(this.lastID);
      }
    );
  });
};

//Check if a given username is present
exports.isUsernamePresent = (db, username) => {
  return new Promise((resolve, reject) => {
    //Create the sql query
    const sql = "SELECT * FROM users WHERE USERNAME = ?";

    //Excecute the query
    db.all(sql, [username], (err, rows) => {
      //Check if any error occurs
      if (err) {
        //Reject the error to the caller
        reject(err);

        return;
      }

      console.log(`rows : ${rows}`);

      //If not, check the answere
      if (rows.length > 0) {
        resolve({ present: true });
      } else {
        resolve({ present: false });
      }
    });
  });
};

//Add a new customer to the DB (need to add the client AND the user!)

//Add a new customer
exports.createNewCustomer = (db, customer) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO customer(NAME, SURNAME, WALLET) VALUES(?, ?, ?)";

    const init_wallet = 0;

    db.run(sql, [customer.name, customer.surname, init_wallet], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

//Add a new user
exports.createNewUser = (db, user) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO users(USERID, USERNAME, HASH, ROLE) VALUES(?, ?, ?, ?)";

    db.run(
      sql,
      [user.userid, user.username, user.hash, user.role],
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

// Post lost food
exports.postLostFood = (db, order) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO lostfood(PRODUCT, QUANTITY, DATE, MONTH, PRODUCTID) VALUES (?, ?, ?, ?, ?)";

    db.run(
      sql,
      [order.product, order.quantity, order.date, order.month, order.productid],
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(order);
      }
    )
  })
};

exports.getProductById = (db, id) => {
  console.log(id);
  let newId = parseInt(id);
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM product WHERE ID = ?";

    db.all(sql, [newId], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        console.log(rows);
        const product = rows.map((e) => ({
          id: e.ID,
          name: e.NAME,
          farmer: e.FARMER,
          price: e.PRICE,
          availability: e.AVAILABILITY,
        }));
        resolve(product);
      }
    )
  })
};

