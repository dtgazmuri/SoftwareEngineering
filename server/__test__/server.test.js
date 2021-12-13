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
  });
  /**Lorenzo Molteni trying to test  getOrderAll and getCustomers functions in employeeDBAccess.js*/
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
        console.log(res.body[0].state);
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

  /*test("responds to /api/farmerOrders/:id with invalid id", async () => {
    const res = await request(app).get(`/api/farmerOrders/tt`);
    expect(res.statusCode).toBe(500);
  });
  test("responds to /api/farmerOrders/:id", () => {
    functions
      .addFarmerAndOrderForTest({ NAME: "test", SURNAME: "test" }, { NAME: "test", PRICE: 1 })
      .then(async (id) => {
        const res = await request(app).get(`/api/farmerOrders/${id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toEqual(0);
        expect(res.body.products).toEqual([{ name: "test", quantity: 1 }]);
      });
  });
  test("responds to /api/confirmOrder/", () => {
    functions
      .addOrderForTest()
      .then(async (id) => {
        farmerDao.confirmOrder(id).then(async () => {
          expect(res.statusCode).toBe(200);
        });
      });
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
  test("resonse to /api/customers/all", () => {
    functions.deleteTable("customer").then(async () => {
      const res = await request(app).get("/api/customers/all");
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  test("resonse to /api/customerlist", () => {
    functions.deleteTable("customer").then(async () => {
      const res = await request(app).get("/api/customerlist");
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  test("resonse to /api/customers/:id when customer does not exist", () => {
    const id = 10;
    functions.deleteTable("customer").then(async () => {
      const res = await request(app).get(`/api/customers/${id}`);
      expect(res.statusCode).toBe(404);
    });
  });
  /*
  test("resonse to /api/customers/:id when customer exists", async () => {
    const newCustomer = { name: "setare", surname: "askari", init_wallet: 500 };
    const id = await employeeDAO.createNewCustomer(db, newCustomer);
    console.log(id);
    const res = await request(app).get(`/api/customers/${id}`);
    expect(res.statusCode).toBe(200);
  });
  */
});
