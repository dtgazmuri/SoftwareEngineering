const express = require("express");
const db = require("../dbTest");
const app = express();
const server = require("../app")(app, db, true);
const request = require("supertest");
const functions = require("./basicFunctions");
const farmerDao = require("../Dao/farmerDAO");
const userDao = require("../Dao/userDao");
const customerDao = require("../Dao/customerDao");
const employeeDAO = require("../Dao/employeeDBAccess");
const managerDAO = require("../Dao/managerDAO");
const { response } = require("express");

//***************************************** TESTING DAO CLASSES************************************************************************** */
describe("Test Dao classes", () => {
  describe("Test userDao functions", () => {
    test("test checkIfUserNotExists while it deosn't", async () => {
      await functions.deleteTable("users");
      functions.deleteTable("users").then(() => {
        return expect(
          userDao.checkIfUserNotExists(db, "test@polito.it")
        ).resolves.toBe();
      });
    });

    test("test checkIfUserNotExists while it deos", async () => {
      const newUser = {
        name: "setare",
        surname: "askari",
        username: "setare@polito.it",
        password: "123456",
      };
      functions
        .addUserForTest(newUser, 1, "123456", "customer")
        .then(() => {
          return expect(
            userDao.checkIfUserNotExists(db, "setare@polito.it")
          ).rejects.toEqual({ code: 409, msg: "user already exits." });
        })
        .catch(() => {});
    });
  });

  describe("test farmerDao functions", () => {
    let testFarmerId;
    let testFarmerOrderId;
    test("test getFarmerProducts while farmer does not exist", async () => {
      functions.deleteTable("product").then(() => {
        return farmerDao.getFarmerProducts(db, 1).then((data) => {
          expect(data).toEqual([]);
        });
      });
    });

    test("test getFarmerProducts", async () => {
      functions
        .addFarmerForTest({ NAME: "test", SURNAME: "test" })
        .then((farmerId) => {
          const newProduct = {
            NAME: "apple",
            PRICE: 100,
          };
          functions
            .addProductForTest(newProduct, farmerId)
            .then((productId) => {
              //console.log(productId);
              return farmerDao.getFarmerProducts(db, farmerId).then((data) => {
                expect(data).toEqual([
                  {
                    id: productId,
                    name: newProduct.NAME,
                    price: newProduct.PRICE,
                  },
                ]);
              });
            });
        });
    });

    test("test ADDProductExpectedAmount", async () => {
      const product = {
        product: 3,
        quantity: 14,
      };
      return farmerDao.addProductExpectedAmount(db, product).then((data) => {
        expect(data).toEqual({
          product: product.product,
          quantity: product.quantity,
        });
      });
    });

    //TEST story #14, farmerDao.getFarmerOrderIds
    test("test getFarmerOrderIds when no order is present", async () => {
      //initializing farmerorder table and checking if empty
      await functions.deleteTable("clientorder");
      const farmerId = await functions.addFarmerForTest({
        NAME: "Lorenzo",
        SURNAME: "Molteni",
      }); //create farmer
      const res = await farmerDao.getFarmerOrderIds(db, farmerId);
      expect(res).toHaveLength(0);

      await functions.deleteTableWhereId("farmer", farmerId);
    });

    test("test getFarmerOrderIds when one order is present", async () => {
      const farmerId = await functions.addFarmerForTest({
        NAME: "Lorenzo",
        SURNAME: "Molteni",
      }); //create farmer
      const newCustomer = { NAME: "CustomerName", SURNAME: "CustomerSurname", WALLET: 50 }; //create customer
      const prodId = await functions.addProductForTest(
        { NAME: "watermelon", PRICE: 13.71 },
        farmerId
      ); //create prod sold by farmer
      const customerId = await functions.addCustomerForTest(newCustomer);
      const clientOrder = await functions.addClientOrder(
        {
          CUSTOMER: customerId,
          STATE: "pending",
          DELIVERY: "False",
          TOTAL: 13.71,
          DATETIME: "2022-01-12 12:00",
          ADDRESS: "Shop"
        }
      );
      const orderItems = await functions.addOrderItem(
        {
          ORDERID: clientOrder,
          PRODUCT: prodId,
          QUANTITY: 1,
          PRICE: 13.71
        }
      );
      
      const expectedResponse = [{id: clientOrder, status: "pending"}];
      const res = await farmerDao.getFarmerOrderIds(db, farmerId);
      expect(res).toEqual(expectedResponse);
  
      //clean db from the data just put
      await functions.deleteTableWhereId("orderitems", orderItems);
      await functions.deleteTableWhereId("clientorder", clientOrder);
      await functions.deleteTableWhereId("customer", customerId);
      await functions.deleteTableWhereId("product", prodId);
      await functions.deleteTableWhereId("farmer", farmerId);
    });

    //TEST story #14, farmerDao.getOrdersInfo
    test("test getOrdersInfo when no order is present", async () => {
      //initializing farmerorder table and checking if empty
      await functions.deleteTable("orderitems");
      await functions.deleteTable("product");
      const farmerId = await functions.addFarmerForTest({
        NAME: "Lorenzo",
        SURNAME: "Molteni",
      }); //create farmer
      const newCustomer = { NAME: "CustomerName", SURNAME: "CustomerSurname", WALLET: 50 }; //create customer
      const customerId = await functions.addCustomerForTest(newCustomer);
      const clientOrder = await functions.addClientOrder(
        {
          CUSTOMER: customerId,
          STATE: "pending",
          DELIVERY: "False",
          TOTAL: 13.71,
          DATETIME: "2022-01-12 12:00",
          ADDRESS: "Shop"
        }
      );
      const res = await farmerDao.getOrdersInfo(db, clientOrder, farmerId);
      expect(res).toHaveLength(0);

      await functions.deleteTableWhereId("farmer", farmerId);
    });

    test("test getOrdersInfo when one order is present", async () => {
      const farmerId = await functions.addFarmerForTest({
        NAME: "Lorenzo",
        SURNAME: "Molteni",
      }); //create farmer
      const newCustomer = { NAME: "CustomerName", SURNAME: "CustomerSurname", WALLET: 50 }; //create customer
      const prodId = await functions.addProductForTest(
        { NAME: "watermelon", PRICE: 13.71 },
        farmerId
      ); //create prod sold by farmer
      const customerId = await functions.addCustomerForTest(newCustomer);
      const clientOrder = await functions.addClientOrder(
        {
          CUSTOMER: customerId,
          STATE: "pending",
          DELIVERY: "False",
          TOTAL: 13.71,
          DATETIME: "2022-01-12 12:00",
          ADDRESS: "Shop"
        }
      );
      const orderItems = await functions.addOrderItem(
        {
          ORDERID: clientOrder,
          PRODUCT: prodId,
          QUANTITY: 1,
          PRICE: 13.71
        }
      );
      
      const expectedResponse = [{ name: "watermelon", quantity: 1 }];
      const res = await farmerDao.getOrdersInfo(db, clientOrder, farmerId);
      expect(res).toEqual(expectedResponse);
  
      //clean db from the data just put
      await functions.deleteTableWhereId("orderitems", orderItems);
      await functions.deleteTableWhereId("clientorder", clientOrder);
      await functions.deleteTableWhereId("customer", customerId);
      await functions.deleteTableWhereId("product", prodId);
      await functions.deleteTableWhereId("farmer", farmerId);
    });

    //TEST story #14, farmerDao.confirmOrder
    test("test confirmOrder when the order is present", async () => {
      const farmerId = await functions.addFarmerForTest({
        NAME: "Lorenzo",
        SURNAME: "Molteni",
      }); //create farmer
      const newCustomer = { NAME: "CustomerName", SURNAME: "CustomerSurname", WALLET: 50 }; //create customer
      const prodId = await functions.addProductForTest(
        { NAME: "watermelon", PRICE: 13.71 },
        farmerId
      ); //create prod sold by farmer
      const customerId = await functions.addCustomerForTest(newCustomer);
      const clientOrder = await functions.addClientOrder(
        {
          CUSTOMER: customerId,
          STATE: "pending",
          DELIVERY: "False",
          TOTAL: 13.71,
          DATETIME: "2022-01-12 12:00",
          ADDRESS: "Shop"
        }
      );
      const orderItems = await functions.addOrderItem(
        {
          ORDERID: clientOrder,
          PRODUCT: prodId,
          QUANTITY: 1,
          PRICE: 13.71
        }
      );
      
      const expectedResponse = { id: clientOrder, state: "confirmed" };
      const res = await farmerDao.confirmOrder(db, clientOrder);
      expect(res).toEqual(expectedResponse);
  
      //clean db from the data just put
      await functions.deleteTableWhereId("orderitems", orderItems);
      await functions.deleteTableWhereId("clientorder", clientOrder);
      await functions.deleteTableWhereId("customer", customerId);
      await functions.deleteTableWhereId("product", prodId);
      await functions.deleteTableWhereId("farmer", farmerId);
    });

    //TEST story #14, farmerDao.getCustomerMail
    test("test getCustomerMail when the customer is present", async () => {
      const farmerId = await functions.addFarmerForTest({
        NAME: "Lorenzo",
        SURNAME: "Molteni",
      }); //create farmer
      const newCustomer = { NAME: "CustomerName", SURNAME: "CustomerSurname", WALLET: 50 }; //create customer
      const prodId = await functions.addProductForTest(
        { NAME: "watermelon", PRICE: 13.71 },
        farmerId
      ); //create prod sold by farmer
      const customerId = await functions.addCustomerForTest(newCustomer);
      const userId = await functions.addUser({USERNAME: "test@gmail.com", USERID: customerId, HASH: "$2b$10$jWmSxke0udXqlelLOqy.SOsiauQF4rXSE45uBNAoGaIfp.Wymwg.m", ROLE: "customer"});
      const clientOrder = await functions.addClientOrder(
        {
          CUSTOMER: customerId,
          STATE: "pending",
          DELIVERY: "False",
          TOTAL: 13.71,
          DATETIME: "2022-01-12 12:00",
          ADDRESS: "Shop"
        }
      );
      const orderItems = await functions.addOrderItem(
        {
          ORDERID: clientOrder,
          PRODUCT: prodId,
          QUANTITY: 1,
          PRICE: 13.71
        }
      );
      
      const expectedResponse = "test@gmail.com";
      const res = await farmerDao.getCustomerMail(db, clientOrder);
      expect(res).toEqual(expectedResponse);
  
      //clean db from the data just put
      await functions.deleteTableWhereId("orderitems", orderItems);
      await functions.deleteTableWhereId("clientorder", clientOrder);
      await functions.deleteTableWhereId("users", userId);
      await functions.deleteTableWhereId("customer", customerId);
      await functions.deleteTableWhereId("product", prodId);
      await functions.deleteTableWhereId("farmer", farmerId);
    });

    //TEST story #15, farmerDao.getFarmerOrders
    test("test getFarmerOrders when no order is present", async () => {
      //initializing farmerorder table and checking if empty
      await functions.deleteTable("farmerorder");
      const res = await farmerDao.getFarmerOrders(db);
      expect(res).toHaveLength(0);
    });

    test("test getFarmerOrders when one order is present", async () => {
      const order = {
        state: "pending",
        total: 5,
        datetime: "2021-12-01 12:00",
      };
      testFarmerId = await functions.addFarmerForTest({
        NAME: "Lorenzo",
        SURNAME: "Molteni",
      });
      testFarmerOrderId = await functions.addFarmerOrderForTest(
        order,
        testFarmerId
      );
      const res = await farmerDao.getFarmerOrders(db);
      expect(res).toEqual([
        {
          id: testFarmerOrderId,
          farmerid: testFarmerId,
          state: "pending",
          total: 5,
          datetime: "2021-12-01 12:00",
          name: "Lorenzo",
          surname: "Molteni",
        },
      ]);
    });

    //TEST story #15, farmerDao.getFarmerOrderItems
    test("test getFarmerOrderItems with a wrong id", async () => {
      const res = await farmerDao.getFarmerOrderItems(db, "www");
      expect(res).toHaveLength(0); //empty array
    });
    test("test getFarmerOrderItems with a correct id but no products", async () => {
      const res = await farmerDao.getFarmerOrderItems(db, testFarmerOrderId);
      expect(res).toHaveLength(0); //empty array
    });
    test("test getFarmerOrderItems with a correct id and one product", async () => {
      const fakeProd = {
        NAME: "watermelon",
        PRICE: 0.99,
      };
      let prodId = await functions.addProductForTest(fakeProd, testFarmerId);
      const fakeProd2 = {
        id: prodId,
        quantity: 2,
        price: fakeProd.PRICE * 2,
      };
      const farmerOrderItemId = await functions.addFarmerOrderItemForTest(
        testFarmerOrderId,
        fakeProd2
      );
      const res = await farmerDao.getFarmerOrderItems(db, testFarmerOrderId);
      expect(res).toEqual([
        {
          id: prodId,
          name: "watermelon",
          price: fakeProd2.price,
          quantity: fakeProd2.quantity,
        },
      ]);
      //deleting the new farmer order item inserted to prevent table growing up
      await functions.deleteTableWhereId("farmerorderitems", farmerOrderItemId);
    });

    //TEST story #15, farmerDao.ackDeliveryFarmerOrder
    test("test ackDeliveryFarmerOrder with a wrong id", async () => {
      const res = farmerDao
        .ackDeliveryFarmerOrder(db, "www")
        .then()
        .catch((err) => {
          //in this case, since the id is wrong, ackDeliveryFarmerOrder rejects, so the return value must be catched with a catch clause
          expect(err.code).toEqual("404");
          expect(err.msg).toEqual("FARMER ORDER NOT FOUND;");
        });
    });
    test("test ackDeliveryFarmerOrder with a correct id", async () => {
      const res = await farmerDao.ackDeliveryFarmerOrder(db, testFarmerOrderId);
      expect(res).toEqual({ id: testFarmerOrderId, state: "delivered" });
    });
  });
  /*test("test getOrdersOfFarmer", async () => {
      functions
        .addFarmerAndOrderForTest({ NAME: "test", SURNAME: "test" }, { NAME: "test", PRICE: 1 })
        .then((farmerId) => {
          return farmerDao.getOrdersForFarmer(db, farmerId).then((data) => {
            expect(data[0]).toEqual({ name: "test", quantity: 1 });
          });
        });
    });
    test("test confirmOrder", async () => {
      functions
        .addOrderForTest()
        .then(() => {
          return farmerDao.confirmOrder(db, 0).then((res) => {
            expect(res.statusCode).toBe(200);
          });
        });
    });*/
  describe("Test customerDao functions", () => {
    //testing getCustomerByUserId
    test("test getCustomerByUserId when id does not exist", async () => {
      functions.deleteTable("customer").then(() => {
        return expect(customerDao.getCustomerByUserId(db, 1)).rejects.toEqual({
          code: "404",
          msg: "not found",
        });
      });
    });
    test("test getCustomerByUserId when id exists", async () => {
      const newCustomer = { NAME: "setare", SURNAME: "askari", WALLET: 100 };
      functions
        .addCustomerForTest(newCustomer)
        .then((id) => {
          return customerDao.getCustomerByUserId(db, id).then((data) => {
            expect(data).toEqual([
              {
                ID: id,
                NAME: newCustomer.NAME,
                SURNAME: newCustomer.SURNAME,
                WALLET: newCustomer.WALLET,
              },
            ]);
          });
        })
        .catch((err) => {
          //console.log(err);
        });
    });

    //testing createClientOrder
    test("test customerDao.createClientOrder", async () => {
      const fakeOrder = {
        customerid: 1,
        state: "pending",
        delivery: false,
        total: 17.31,
        date: "2021-12-01 12:00",
      };
      const orderId = await customerDao.createClientOrder(db, fakeOrder);
      expect(orderId).toBeGreaterThan(0);
      //elimino la entry di test appena messa nel db
      await functions.deleteTableWhereId("clientorder", orderId);
    });

  });
  describe("Test employeeDAO functions", () => {
    let customerId;
    //TESTING getCustomers
    test("test getCustomers when no customer is present", async () => {
      await functions.deleteTable("customer");
      const res = await employeeDAO.getCustomers(db);
      expect(res).toEqual([]);
    });
    test("test getCustomers when some customer is present", async () => {
      const fakeCustomer = {
        NAME: "lorenzo",
        SURNAME: "molteni",
        WALLET: 1000,
      };
      customerId = await functions.addCustomerForTest(fakeCustomer);
      await functions.addUserForTest(
        { username: "lorenzo@polito.it" },
        customerId,
        "789123",
        "customer"
      );
      const res = await employeeDAO.getCustomers(db);
      expect(res).toHaveLength(1);
      expect(res).toEqual([
        {
          id: customerId,
          name: "lorenzo",
          surname: "molteni",
          wallet: 1000,
          username: "lorenzo@polito.it",
        },
      ]);
    });

    //TESTING listProductsAll
    test("test listProductsAll when no product is present", async () => {
      await functions.deleteTable("product");
      const res = await employeeDAO.listProductsAll(db);
      expect(res).toEqual([]);
    });
    //TODO: complete testing
    test("test listProductsAll when 1 product is present", async () => {
      const farmerId = await functions.addFarmerForTest({
        NAME: "Lorenzo",
        SURNAME: "Molteni",
      }); //create farmer
      const prodId = await functions.addProductForTest(
        { NAME: "watermelon", PRICE: 13.71 },
        farmerId
      ); //create prod sold by farmer
      await functions.addProductToWarehouse(prodId);

      const res = await employeeDAO.listProductsAll(db);
      expect(res).not.toEqual([]);
      expect(res).toEqual([
        {
          id: prodId,
          name: "watermelon",
          farmerid: farmerId,
          price: 13.71,
          quantity: 0, //default value put inside basicFunctions.addProductToWarehouse
          availability: 0,
        },
      ]); //default value put inside basicFunctions.addProductForTest

      //clean the db from the values just put
      await functions.deleteWarehouseWhereProdId(prodId);
      await functions.deleteTableWhereId("product", prodId);
      await functions.deleteTableWhereId("farmer", farmerId);
    });

    //TESTING getOrderAll
    test("test getOrderAll when no order is present", async () => {
      await functions.deleteTable("clientorder");
      const res = await employeeDAO.getOrderAll(db);
      expect(res).toHaveLength(0);
    });

    test("test getOrderAll when some orders are present", async () => {
      const fakeOrder1 = {
        customerid: 1,
        state: "pending",
        delivery: false,
        total: 17.31,
        date: "2021-12-01 12:00",
      };
      const orderId = await employeeDAO.createClientOrder(db, fakeOrder1);
      const res = await employeeDAO.getOrderAll(db);
      expect(res).toHaveLength(1);
    });
    test("test updateCustomerWallet‍ with correct data", async () => {
      const fakeCustomer = {
        NAME: "setare",
        SURNAME: "askari",
        WALLET: 1000,
      };
      customerId = await functions.addCustomerForTest(fakeCustomer);
      const id = await employeeDAO.updateCustomerWallet(db, customerId, 2000);
      expect(id).toEqual(customerId);
    });
    test("test handOutOrder", async () => {
      const fakeOrder = {
        customerid: 1,
        state: "pending",
        delivery: false,
        total: 17.31,
        date: "2021-12-01 12:00",
      };
      const orderId = await employeeDAO.createClientOrder(db, fakeOrder);
      const id = await employeeDAO.handOutOrder(db, orderId);
      expect(id).toEqual(orderId);
    });
    test("test createClientOrder", async () => {
      const fakeOrder = {
        customerid: 1000,
        state: "pending",
        delivery: false,
        total: 17.31,
        date: "2021-12-01 12:00",
      };
      const orderId = await employeeDAO.createClientOrder(db, fakeOrder);
      const orders = await functions.getClientOrderById(orderId);
      expect(orders[0].customer).toEqual(1000);
    });
    test("test creatOrderItem", async () => {
      const newItem = { orderid: 100, productid: 10, quantity: 50, price: 102 };
      const itemId = await employeeDAO.createOrderItem(db, newItem);
      expect(typeof itemId).toBe("number");
    });
    test("test createNewCustomer", async () => {
      const newCustomer = { name: "setare", surname: "askari", wallet: 50 };
      const id = await employeeDAO.createNewCustomer(db, newCustomer);
      expect(typeof id).toBe("number");
    });
    test("test createNewUser", async () => {
      const newUser = {
        userid: 500,
        username: "askari",
        hash: "1234456",
        role: "customer",
      };
      const id = await employeeDAO.createNewUser(db, newUser);
      expect(typeof id).toBe("number");
    });

    //testing story#41, about manager reports
    test("test postLostFood", async () => {
      let order = {
        product: "watermelon",
        quantity: 12,
        date: "2021-12-27 12:15",
        month: 12,
        productid: 1,
      }
      
      const res = await employeeDAO.postLostFood(db, order);
      expect(res).toEqual(order);
      await functions.deleteTable("lostfood");
    });
    test("test lostOrderStatus", async () => {  
      const fakeOrder = {
        customerid: 1000,
        state: "pending",
        delivery: false,
        total: 17.31,
        date: "2021-12-01 12:00",
      };
      //create a pending order, set it as lost, and check if its state has changed
      const orderid = await employeeDAO.createClientOrder(db, fakeOrder);
      await employeeDAO.lostOrderStatus(db, orderid);
      const orders = await functions.getClientOrderById(orderid);
      expect(orders[0].state).toEqual("lost");
    });
    

  });
  describe("Test managerDAO functions", () => {
    //testing getReports
    test("test getReports", async () => {
      const weekReport = {
        type: 0,
        initialdate: "2021-11-01",
        finaldate: "2021-11-07"
      };
      const monthlyReport = {
        type: 1,
        initialdate: "2021-11-01",
        finaldate: "2021-11-30"
      };
  
      await functions.addManagerReport(weekReport);
      await functions.addManagerReport(monthlyReport);
      const res = await managerDAO.getReports(db);
      expect(res).toHaveLength(2);

      await functions.deleteTable("reports");
      const res2 = await managerDAO.getReports(db);
      expect(res2).toHaveLength(0);
    });

    //testing getLostFood
    test("test getLostFood", async () => {
      let lostFood = {
        product: "watermelon",
        quantity: 12,
        date: "2021-12-27 12:15",
        month: 12,
        productid: 1,
      }
      //putting lostfood
      await employeeDAO.postLostFood(db, lostFood);
      const res = await managerDAO.getLostFood(db);
      expect(res).toHaveLength(1);

      await functions.deleteTable("lostfood");
      const res2 = await managerDAO.getLostFood(db);
      expect(res2).toHaveLength(0);
    });
  });
});

//********************************************** TESTING API ************************************************************************** */

describe("Test api's", () => {
  /* test("responds to /api/orders/all with no order present", () => {
    functions.deleteTable("clientorder").then(async () => {
      const res = await request(app).get("/api/orders/all");
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });
  }); */
  test("responds to /api/orders/all with order present", () => {
    functions.deleteTable("clientorder").then(() => {
      const fakeOrder = {
        customerid: 1,
        state: "pending",
        delivery: true,
        total: 16.3,
        date: "2021-12-01 12:15",
      };
      employeeDAO.createClientOrder(db, fakeOrder).then(async (id) => {
        const res = await request(app).get("/api/orders/all");
        //console.log(res.body[0].state);
        expect(res.statusCode).toBe(200);
        expect(res.body[0].state).toEqual("pending");
        //  expect(res.body[0].delivery.toEqual(true));
        //  expect(res.body[0].total.toEqual(17.3));
      });
    });
  });
  test("responds to /api/products/all", async () => {
    const res = await request(app).get("/api/products/all");
    expect(res.statusCode).toBe(200);
  });

  test("responds to /api/products/all", () => {
    const newProduct = {
      NAME: "lemon",
      PRICE: 200,
    };
    functions.addProductForTest(newProduct, 10).then((id) => {
      functions.addProductToWarehouse(id).then(async () => {
        const res = await request(app).get("/api/products/all");
        expect(res.statusCode).toBe(200);
        expect(res.body[0].name).toEqual(newProduct.NAME);
        expect(res.body[0].price).toEqual(newProduct.PRICE);
      });
    });
  });

  test("responds to api/farmer/:id with invalid id", async () => {
    const res = await request(app).get(`/api/farmer/tt`);
    expect(res.statusCode).toBe(500);
  });

  test("responds to api/farmer/:id", () => {
    functions
      .addFarmerForTest({ NAME: "test", SURNAME: "test" })
      .then(async (id) => {
        const res = await request(app).get(`/api/farmer/${id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.name).toEqual("test");
        expect(res.body.surname).toEqual("test");
      });
  });
  /* removed because all tests are logged in
  test("responds to /api/farmerOrders/:id with invalid id", async () => {
    const res = await request(app).get(`/api/farmerOrders/tt`);
    expect(res.statusCode).toBe(500);
  });*/

  test("responds to /api/farmerOrders/:id", async () => {
    const farmerId = await functions.addFarmerForTest({
      NAME: "Lorenzo",
      SURNAME: "Molteni",
    }); //create farmer
    const newCustomer = { NAME: "CustomerName", SURNAME: "CustomerSurname", WALLET: 50 }; //create customer
    const prodId = await functions.addProductForTest(
      { NAME: "watermelon", PRICE: 13.71 },
      farmerId
    ); //create prod sold by farmer
    const customerId = await functions.addCustomerForTest(newCustomer);
    const clientOrder = await functions.addClientOrder(
      {
        CUSTOMER: customerId,
        STATE: "pending",
        DELIVERY: "False",
        TOTAL: 13.71,
        DATETIME: "2022-01-12 12:00",
        ADDRESS: "Shop"
      }
    );
    const orderItems = await functions.addOrderItem(
      {
        ORDERID: clientOrder,
        PRODUCT: prodId,
        QUANTITY: 1,
        PRICE: 13.71
      }
    );
    
    const expectedResponse = {
      id: clientOrder,
      products: [
        {
          name: "watermelon",
          quantity: 1
        },
      ],
      status: "pending"
    };
    const res = await request(app).get(`/api/farmerOrders/${farmerId}`);
    expect(res.body).toEqual([expectedResponse]);

    //clean db from the data just put
    await functions.deleteTableWhereId("orderitems", orderItems);
    await functions.deleteTableWhereId("clientorder", clientOrder);
    await functions.deleteTableWhereId("customer", customerId);
    await functions.deleteTableWhereId("product", prodId);
    await functions.deleteTableWhereId("farmer", farmerId);
    
  });
  //What's the problem?
  /*test("responds to /api/confirmOrder/", async () => {
    const newCustomer = { NAME: "CustomerName", SURNAME: "CustomerSurname", WALLET: 50 }; //create customer
    const customerId = await functions.addCustomerForTest(newCustomer);
    const clientOrder = await functions.addClientOrder(
      {
        CUSTOMER: customerId,
        STATE: "pending",
        DELIVERY: "False",
        TOTAL: 13.71,
        DATETIME: "2022-01-12 12:00",
        ADDRESS: "Shop"
      }
    );

    const res = await request(app)
    .post("/api/confirmOrder/")
    .send({
      id: clientOrder,
    });
    expect(res.statusCode).toEqual(200);
    
    await functions.deleteTableWhereId("clientorder", clientOrder);
    await functions.deleteTableWhereId("customer", customerId);
  });*/

  /* removed because all tests are logged in 
  test("response to api/orders/insufficientWallet if unlogged", async () => {
    const res = await request(app).get("/api/orders/insufficientWallet");
    expect(res.statusCode).toEqual(401);
  });
  */
  test("response to api/orders/insufficientWallet if logged", async () => {
    const response = await request(app).get("/api/orders/insufficientWallet");
    expect(response.body).toEqual({});
    expect(response.statusCode).toBe(404);
  });
  test("response to /api/order/employee", async () => {
    const res = await request(app)
      .post("/api/order/employee")
      .send({
        customerid: 1,
        state: "pending",
        delivery: "true",
        total: 9.99,
        address: "via paolo borsellino 40",
        listitems: [{ id: 1, quantity: 12, price: 2 }],
      });
    expect(res.statusCode).toBe(200);
  });
  test("response to /api/order/employee with incorrect customerid", async () => {
    const res = await request(app).post("/api/order/employee").send({
      customerid: "string",
      state: "pending",
      delivery: "true",
      total: 9.99,
      address: "via paolo borsellino 40",
      listitems: [],
    });
    expect(res.statusCode).toBe(422);
  });

  test("response to /api/order/employee with incorrect state", async () => {
    const res = await request(app).post("/api/order/employee").send({
      customerid: 1,
      state: 12,
      delivery: "true",
      total: 9.99,
      address: "via paolo borsellino 40",
      listitems: [],
    });
    expect(res.statusCode).toBe(422);
  });

  test("response to /api/order/employee with incorrect delivery", async () => {
    const res = await request(app).post("/api/order/employee").send({
      customerid: 1,
      state: "pending",
      delivery: "",
      total: 9.99,
      address: "via paolo borsellino 40",
      listitems: [],
    });
    expect(res.statusCode).toBe(422);
  });

  test("response to /api/order/employee with incorrect total", async () => {
    const res = await request(app).post("/api/order/employee").send({
      customerid: 1,
      state: "pending",
      delivery: "true",
      total: "total",
      address: "via paolo borsellino 40",
      listitems: [],
    });
    expect(res.statusCode).toBe(422);
  });
  test("response to /api/order/employee with incorrect listitems", async () => {
    const res = await request(app)
      .post("/api/order/employee")
      .send({
        customerid: 1,
        state: "pending",
        delivery: "true",
        total: "9.99",
        address: "via paolo borsellino 40",
        listitems: [{ id: "id", quantity: 12, price: 2 }],
      });
    expect(res.statusCode).toBe(422);
  });

  //API tests for story #13
  test("response to /api/order/customer", async () => {
    const res = await request(app)
      .post("/api/order/customer")
      .send({
        customerid: 1,
        state: "pending",
        delivery: "true",
        total: 9.99,
        address: "via paolo borsellino 40",
        listitems: [{ id: 1, quantity: 12, price: 2 }],
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("orderid");
  });
  test("response to /api/order/customer with incorrect customerid", async () => {
    const res = await request(app).post("/api/order/customer").send({
      customerid: "string",
      state: "pending",
      delivery: "true",
      total: 9.99,
      address: "via paolo borsellino 40",
      listitems: [],
    });
    expect(res.statusCode).toBe(422);
    expect(res.body).toHaveProperty("errors");
  });
  test("response to /api/order/customer with incorrect state", async () => {
    const res = await request(app).post("/api/order/customer").send({
      customerid: 1,
      state: 12,
      delivery: "true",
      total: 9.99,
      address: "via paolo borsellino 40",
      listitems: [],
    });
    expect(res.statusCode).toBe(422);
    expect(res.body).toHaveProperty("errors");
  });
  
  test("response to /api/order/customer with incorrect delivery", async () => {
    const res = await request(app).post("/api/order/customer").send({
      customerid: 1,
      state: "pending",
      delivery: "",
      total: 9.99,
      address: "via paolo borsellino 40",
      listitems: [],
    });
    expect(res.statusCode).toBe(422);
    expect(res.body).toHaveProperty("errors");
  });
  
  test("response to /api/order/customer with incorrect total", async () => {
    const res = await request(app).post("/api/order/customer").send({
      customerid: 1,
      state: "pending",
      delivery: "true",
      total: "total",
      address: "via paolo borsellino 40",
      listitems: [],
    });
    expect(res.statusCode).toBe(422);
    expect(res.body).toHaveProperty("errors");
  });
  test("response to /api/order/customer with incorrect listitems", async () => {
    const res = await request(app)
      .post("/api/order/customer")
      .send({
        customerid: 1,
        state: "pending",
        delivery: "true",
        total: "9.99",
        address: "via paolo borsellino 40",
        listitems: [{ id: "id", quantity: 12, price: 2 }],
      });
    expect(res.statusCode).toBe(422);
    expect(res.body).toHaveProperty("errors");
  });
  //end of API tests for story #13

  test("response to /api/orders/:id/handOut", async () => {
    const id = 1;
    const res = await request(app).post(`/api/orders/${id}/handOut`);
    expect(res.statusCode).toBe(200);
  });
  test("response to /api/orders/:id/handOut with incorrect id", async () => {
    const id = "id";
    const res = await request(app).post(`/api/orders/${id}/handOut`);
    expect(res.statusCode).toBe(422);
  });
  test("response to /api/warehouse", async () => {
    const res = await request(app).post("/api/warehouse").send({
      product: 1,
      quantity: 2,
    });
    expect(res.statusCode).toBe(200);
  });
  test("response to /api/warehouse with incorrect product", async () => {
    const res = await request(app).post("/api/warehouse").send({
      product: "apple",
      quantity: 2,
    });
    expect(res.statusCode).toBe(422);
  });
  test("response to /api/warehouse with incorrect quantity", async () => {
    const res = await request(app).post("/api/warehouse").send({
      product: 1,
      quantity: "wrwert",
    });
    expect(res.statusCode).toBe(422);
  });
  test("response to /api/users/registration", async () => {
    const res = await request(app).post("/api/users/registration").send({
      username: "setareaskari@gmail.com",
      password: "123456",
      role: "customer",
      name: "setare",
      surname: "askari",
    });
    expect(res.statusCode).toBe(201);
  });

  test("response to /api/users/registration with invalid username", async () => {
    const res = await request(app).post("/api/users/registration").send({
      username: "setareaskari",
      password: "123456",
      role: "customer",
      name: "setare",
      surname: "askari",
    });
    expect(res.statusCode).toBe(400);
  });

  test("response to /api/users/registration => without password", async () => {
    const res = await request(app).post("/api/users/registration").send({
      username: "setareaskari",
      role: "customer",
      name: "setare",
      surname: "askari",
    });
    expect(res.statusCode).toBe(400);
  });

  test("response to /api/users/registration => without role", async () => {
    const res = await request(app).post("/api/users/registration").send({
      username: "setareaskari",
      password: "123456",
      name: "setare",
      surname: "askari",
    });
    expect(res.statusCode).toBe(400);
  });

  test("response to /api/users/registration without name", async () => {
    const res = await request(app).post("/api/users/registration").send({
      username: "setareaskari@gmail.com",
      password: "123456",
      role: "customer",
      surname: "askari",
    });
    expect(res.statusCode).toBe(400);
  });
  test("response to /api/users/registration without surname", async () => {
    const res = await request(app).post("/api/users/registration").send({
      username: "setareaskari@gmail.com",
      password: "123456",
      role: "customer",
      name: "setare",
    });
    expect(res.statusCode).toBe(400);
  });

  /*
  test("response to /api/username/present/:id when id exists", async () => {
    const id = 1;
    const res = await request(app).get(`/api/username/present/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.present).toEqual(true);
  });
  */
  test("response to /api/username/present/:id when id does not exist", async () => {
    const id = 100;
    const res = await request(app).get(`/api/username/present/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.present).toEqual(false);
  });
  test("resonse to /api/customers/all", async () => {
    await functions.deleteTable("customer");
    const res = await request(app).get("/api/customers/all");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });  

  test("resonse to /api/customers/:id when customer does not exist", async () => {
    const id = 10;
    await functions.deleteTable("customer");
    const res = await request(app).get(`/api/customers/${id}`);
    expect(res.statusCode).toBe(404);
  });
  
  test("resonse to /api/customers/:id when customer exists", async () => {
    const newCustomer = { name: "setare", surname: "askari", init_wallet: 500 };
    const id = await employeeDAO.createNewCustomer(db, newCustomer);
    const res = await request(app).get(`/api/customers/${id}`);
    //expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{ID: id, NAME: newCustomer.name, SURNAME: newCustomer.surname, WALLET: 0}]);
  });
  
  
  //TEST story#15
  //TEST /api/farmerOrders
  test("response to /api/farmerOrders when table it's empty", async () => {
    await functions.deleteTable("farmerorder");
    const res = await request(app).get("/api/farmerOrders");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });
  test("response to /api/farmerOrders when table contains something", async () => {
    //create a farmer, a product sold by that farmer, a farmer order and connect the farmer order to the product (farmerorderitems)
    const order = {
      state: "pending",
      total: 5,
      datetime: "2021-12-01 12:00",
    };
    const farmerId = await functions.addFarmerForTest({
      NAME: "Lorenzo",
      SURNAME: "Molteni",
    }); //create farmer
    const prodId = await functions.addProductForTest(
      { NAME: "watermelon", PRICE: 13.71 },
      farmerId
    ); //create prod sold by farmer
    const farmerOrderId = await functions.addFarmerOrderForTest(
      order,
      farmerId
    );
    const fakeProd = {
      id: prodId,
      quantity: 2,
      price: 13.71 * 2,
    };
    const farmerOrderItemId = await functions.addFarmerOrderItemForTest(
      farmerOrderId,
      fakeProd
    );
    const expectedResponse = {
      id: farmerOrderId,
      farmerid: farmerId,
      farmerName: "Lorenzo",
      farmerSurname: "Molteni",
      state: order.state,
      total: order.total,
      time: order.datetime,
      listitems: [
        {
          id: prodId,
          quantity: fakeProd.quantity,
          name: "watermelon",
          price: fakeProd.price,
        },
      ],
    };
    const res = await request(app).get("/api/farmerOrders");
    //expect(res.statusCode).toBe(200);
    //expect(res.body).toHaveLength(1);
    expect(res.body).toEqual([expectedResponse]);

    //clean db from the data just put
    await functions.deleteTableWhereId("farmerorderitems", farmerOrderItemId);
    await functions.deleteTableWhereId("farmerorder", farmerOrderId);
    await functions.deleteTableWhereId("product", prodId);
    await functions.deleteTableWhereId("farmer", farmerId);
  });
  
  //TEST /api/farmerOrders/:id/ack
  test("response to /api/farmerOrders/:id/ack with a string instead of id ", async () => {
    await functions.deleteTable("farmerorder");
    const res = await request(app).post("/api/farmerOrders/www/ack");
    expect(res.statusCode).toBe(422);
    expect(res.body).not.toBe({});
  });
  test("response to /api/farmerOrders/:id/ack with wrong request body", async () => {
    const res = await request(app)
      .post("/api/farmerOrders/1/ack")
      .send({ id: 1, newState: "test" });
    expect(res.statusCode).toBe(422);
    expect(res.body).not.toBe({});
    const res2 = await request(app)
      .post("/api/farmerOrders/1/ack")
      .send({ id: 12, newState: "delivered" }); //id in path and in body differs
    expect(res.statusCode).toBe(422);
    expect(res.body).not.toBe({});
  });
  test("response to /api/farmerOrders/:id/ack with unexisting id", async () => {
    const res = await request(app)
      .post("/api/farmerOrders/1/ack")
      .send({ id: 1, newState: "delivered" });
    expect(res.statusCode).toBe(404);
  });
  test("response to /api/farmerOrders/:id/ack with correct id", async () => {
    //create a farmer, a product sold by that farmer, a farmer order and connect the farmer order to the product (farmerorderitems)
    const order = {
      state: "pending",
      total: 5,
      datetime: "2021-12-01 12:00",
    };
    const farmerId = await functions.addFarmerForTest({
      NAME: "Lorenzo",
      SURNAME: "Molteni",
    }); //create farmer
    const farmerOrderId = await functions.addFarmerOrderForTest(
      order,
      farmerId
    );

    const res = await request(app)
      .post(`/api/farmerOrders/${farmerOrderId}/ack`)
      .send({ id: farmerOrderId, newState: "delivered" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ id: farmerOrderId, state: "delivered" });

    //clean db from the data just put
    await functions.deleteTableWhereId("farmerorder", farmerOrderId);
    await functions.deleteTableWhereId("farmer", farmerId);
  });

  //STORY #41
  //testing EmployeeAPI.lostOrderStatus -> api/orders/:id/reportLost
  test("response to /api/orders/:id/reportLost with a string instead of id ", async () => {
    const res = await request(app).post("/api/orders/www/reportLost");
    expect(res.statusCode).toBe(422);
    expect(res.body).not.toBe({});
  });
  test("response to /api/orders/:id/reportLost with a correct id ", async () => {
    const res = await request(app).post("/api/orders/1/reportLost");
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe("1");
  });

  //testing EmployeeAPI.postLostFood -> api/lostfood
  test("response to /api/lostfood with a correct body", async () => {
    const productData = {
      name: "productName",
      quantity: 12,
      date: "2021-12-27 12:15",
      month: 12,
      productid: 1,
  }
    const res = await request(app).post("/api/lostfood").send(productData);
    expect(res.statusCode).toBe(200);
    await functions.deleteTable("lostfood");
  });
  test("response to /api/lostfood with a wrong body", async () => {
    const productData = {
      name: "productName"
    }
    const res = await request(app).post("/api/lostfood").send(productData);
    expect(res.statusCode).toBe(422);
  });

  //testing ManagerAPI.getManagerReports -> /api/managerReports
  test("response to /api/managerReports when no reports are present", async () => {
    const res = await request(app).get("/api/managerReports");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(0);
  });
  test("response to /api/managerReports when some reports are present", async () => {
    const weekReport = {
      type: 0,
      initialdate: "2021-11-01",
      finaldate: "2021-11-07"
    };
    const monthlyReport = {
      type: 1,
      initialdate: "2021-11-01",
      finaldate: "2021-11-30"
    };

    const id1 = await functions.addManagerReport(weekReport);
    const id2 = await functions.addManagerReport(monthlyReport);
    const res = await request(app).get("/api/managerReports");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(2);

    //delete reports just created
    await functions.deleteTableWhereId("reports", id1);
    await functions.deleteTableWhereId("reports", id2);
  });

  
});
