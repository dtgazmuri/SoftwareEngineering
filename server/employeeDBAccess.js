/* This file contain the SQL query for the DB for the employee requests */

const db = require('./db')


// get all products (with the werehouse quantity)
exports.listProductsAll = () => {
    return new Promise((resolve, reject) => {

        //Create the sql query
        const sql = 'SELECT * FROM product, warehouse WHERE product.ID = warehouse.PRODUCT';

        //Excecute the query
        db.all(sql, [], (err, rows) => {

            //Check if any error occurs
            if (err) {

                //Reject the error to the caller
                reject(err);

                return;
            }


            //If not, map the answere on a const array
            const products = rows.map((e) => ({ id: e.ID, name: e.NAME, farmerid: e.FARMER, price: e.PRICE, quantity: e.QUANTITY }));
            
            //Return the new generated array of objects
            resolve(products);
        });
    });
};

//Check if the username is already present in the client table (or in the users table?) <- User is fine


//Get the farmer info given it's ID
exports.getFarmerById = (farmer_id) => {
    return new Promise((resolve, reject) => {

        //Create the sql query (the ? is for the farmer_id)
        const sql = 'SELECT * FROM farmer WHERE ID = ?';

        //Excecute the query (pass the farmer_id as a parameter)
        db.all(sql, [farmer_id], (err, rows) => {

            //Check if any error occurs
            if (err) {

                //Reject the error to the caller
                reject(err);

                return;
            }


            //If not, map the answere on a SINGLE object
            const farmers = rows.map((e) => ({ id: e.ID, name: e.NAME, surname: e.SURNAME }));
            
            //Check the array length (it SHOULD be one)
            if (farmers.length == 1){
                const farmer = farmers[0];

                //Return the new generated object
                resolve(farmer);
            }
            else{
                resolve({error: `the number of farmers returned with the given code is ${farmers.length} instead of 1`}); 
            }

            
        });
    });
};


// get all orderitems of a given order ID
exports.getOrderItems = (order_id) => {
    return new Promise((resolve, reject) => {

        //Create the sql query
        const sql = 'SELECT * FROM orderitems WHERE ORDERID = ?';

        //Excecute the query
        db.all(sql, [order_id], (err, rows) => {

            //Check if any error occurs
            if (err) {

                //Reject the error to the caller
                reject(err);

                return;
            }


            //If not, map the answere on a const array
            const items = rows.map((e) => ({ id: e.ID, orderid: e.ORDERID, productid: e.PRODUCT, quantity: e.QUANTITY, price: e.PRICE}));
            
            //Return the new generated array of objects
            resolve(items);
        });
    });
};


// get all the orders
exports.getOrderAll = () => {
    return new Promise((resolve, reject) => {

        //Create the sql query
        const sql = 'SELECT * FROM clientorder';

        //Excecute the query
        db.all(sql, [], (err, rows) => {

            //Check if any error occurs
            if (err) {

                

                //Reject the error to the caller
                reject(err);

                return;
            }

            //If not, map the answere on a const array
            const orders = rows.map((e) => ({ id: e.ID, customerid: e.CUSTOMER, state: e.STATE, delivery: e.DELIVERY, total: e.TOTAL}));

            //Return the new generated array of objects
            resolve(orders);
        });
    });
};

// get all the orders of a given customer
exports.getOrderByCustomer = (customer_id) => {
    return new Promise((resolve, reject) => {

        //Create the sql query
        const sql = 'SELECT * FROM order WHERE CUSTOMER = ?';

        //Excecute the query
        db.all(sql, [customer_id], (err, rows) => {

            //Check if any error occurs
            if (err) {

                //Reject the error to the caller
                reject(err);

                return;
            }


            //If not, map the answere on a const array
            const orders = rows.map((e) => ({ id: e.ID, customerid: e.CUSTOMER, state: e.STATE, delivery: e.DELIVERY, total: e.TOTAL}));
            
            //Return the new generated array of objects
            resolve(orders);
        });
    });
};

//Add a new client order
exports.createClientOrder = (order) => {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO clientorder(CUSTOMER, STATE, DELIVERY, TOTAL) VALUES(?, ?, ?, ?)';
      
      db.run(sql, [order.customerid, order.state, order.delivery, order.total], function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);
      });
    });
  };

//Add a new order item
exports.createOrderItem = (item) => {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO orderitems(ORDERID, PRODUCT, QUANTITY, PRICE) VALUES(?, ?, ?, ?)';
      
      db.run(sql, [item.orderid, item.productid, item.quantity, item.price], function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);
      });
    });
  };