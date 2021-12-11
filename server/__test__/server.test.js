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

describe("Test Dao classes", () => {
  describe("Test userDao functions", () => {
    test("test checkIfUserNotExists while it deosn't", async () => {
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
  });

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
    //TESTING getCustomers
    test("test getCustomers when no customer is present", async () => {
      functions.deleteTable("customer").then(() => {
        employeeDAO
          .getCustomers(db)
          .then((data) => {
            expect(data).toEqual([]);
          })
          .catch((err) => {
            return err;
          });
      });
    });
    test("test getCustomers when some customer is present", async () => {
      const fakeCustomer = {
        NAME: "lorenzo",
        SURNAME: "molteni",
        WALLET: 1000,
      };

      functions
        .addCustomerForTest(fakeCustomer)
        .then((id) => {
          functions
            .addUserForTest(
              { username: "lorenzo@polito.it" },
              id,
              "789123",
              "customer"
            )
            .then(() => {
              return employeeDAO.getCustomers(db).then((data) => {
                expect(data.length).toEqual(1);
                expect(data).toEqual([
                  {
                    id: id,
                    name: "lorenzo",
                    surname: "molteni",
                    wallet: 1000,
                    username: "lorenzo@polito.it",
                  },
                ]);
              });
            })
            .catch((err) => {});
        })
        .catch((err) => {});
    });

    //TESTING getOrderAll
    test("test getOrderAll when no order is present", async () => {
      functions.deleteTable("clientorder").then(() => {
        employeeDAO
          .getOrderAll(db)
          .then((data) => {
            expect(data.length).toEqual(0);
          })
          .catch((err) => {
            return err;
          });
      });
    });

    test("test getOrderAll when some orders are present", async () => {
      const fakeOrder1 = {
        customerid: 1,
        state: "pending",
        delivery: false,
        total: 17.31,
        date: "2021-12-01 12:00",
      };
      employeeDAO
        .createClientOrder(db, fakeOrder1)
        .then((id) => {
          employeeDAO
            .getOrderAll(db)
            .then((data) => {
              expect(data).toEqual([
                {
                  id: id,
                  customerid: 1,
                  state: "pending",
                  delivery: false,
                  total: 17.31,
                },
              ]);
            })
            .catch((err) => {
              return err;
            });
        })
        .catch((err) => {});
    });
  });
});

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
  /* removed because all tests are logged
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
});
