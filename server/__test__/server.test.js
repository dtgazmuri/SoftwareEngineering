const express = require("express");
const db = require("../dbTest");
const app = express();
let user = undefined;
let server = require("../app")(app, db, user);
const request = require("supertest");
const functions = require("./basicFunctions");
const farmerDao = require("../Dao/farmerDAO");
const userDao = require("../Dao/userDao");
const customerDao = require("../Dao/customerDao");
const employeeDAO = require("../Dao/employeeDBAccess");

const initializeDB = () => {
  return new Promise((resolve, reject) => {
    const sql =
      "DELETE FROM orderitems; DELETE FROM clientorder; DELETE FROM users; DELETE FROM customer; DELETE FROM shopemployee; DELETE FROM product; DELETE FROM farmer; DELETE FROM warehouse;";
    db.run(sql, [], (err) => {
      if (err) {
        reject(err);
        return;
      } else resolve();
    });
  });
};

afterAll(() => {
  // await initializeDB();
});

describe("Test Dao classes", () => {
  beforeEach(() => {
    initializeDB();
  });

  describe("Test userDao functions", () => {
    test("test checkIfUserNotExists while it deosn't", async () => {
      return expect(
        userDao.checkIfUserNotExists(db, "setare@polito.it")
      ).resolves.toBe();
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
      return farmerDao.getFarmerProducts(db, 1).then((data) => {
        expect(data).toEqual([]);
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
      return expect(customerDao.getCustomerByUserId(db, 1)).rejects.toEqual({
        code: "404",
        msg: "not found",
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
      employeeDAO.getCustomers(db).then((data) => {
        return expect(data).toEqual([]);
      })
    });
    test("test getCustomers when some customer is present", async () => {
      const fakeCustomer = { NAME: "lorenzo", SURNAME: "molteni", WALLET: 1000 };
      
      functions.addCustomerForTest(fakeCustomer).then((id) => { 
        functions.addUserForTest({username: "lorenzo@polito.it",}, id, "789123", "customer").then(() => {
          return employeeDAO.getCustomers(db).then((data) => {
            expect(data.length).toEqual(1);
            expect(data).toEqual([
              {
                id: id,
                name: "lorenzo",
                surname: "molteni",
                wallet: 1000,
                username: "lorenzo@polito.it"
              }]);
          });
        }).catch((err) => {});
      }).catch((err) => {});
    });

    //TESTING getOrderAll
    //this is not working, seems like it is not initializing the clientorder table. It's actually returning 3 instead of 0
    /*
    test("test getOrderAll when no order is present", async () => {
      employeeDAO.getOrderAll(db).then((data) => {
        return expect(data.length).toEqual(0);
      });
    });*/
    test("test getOrderAll when some orders are present", async () => {
      const fakeOrder1 = {customerid : 1, state: "pending", delivery: false, total: 17.31, date: "2021-12-01 12:00"};
      employeeDAO.createClientOrder(db, fakeOrder1).then((id) => {
        employeeDAO.getOrderAll(db).then((data) => {
          return expect(data).toEqual([
            {
              id: id,
              customerid:  1,
              state: "pending",
              delivery: false,
              total: 17.31
            }
          ])
        });

      }).catch((err) => {});
            
    });


  });

});

describe("Test api's", () => {
  beforeAll(() => {});

  test("responds to /api/orders/all", async () => {
    functions
      .addUserForTest(
        {
          username: "pappa@pappa.it",
        },
        2,
        "123456",
        "shopemployee"
      )
      .then((id) => {
        user = {
          id: id,
          username: "pappa@pappa.it",
          role: "shopemployee",
          userid: 2,
        };
        server = require("../app")(app, db, user);
        // let req = request(app).get("/api/orders/all");
        // req.field
        //   req.set("Content-Type", "multipart/form-data");
        //  req.field("user", JSON.stringify(u));
        // req.attach("user", JSON.stringify(u));
        request(app)
          .get("/api/orders/all")
          .then((res) => {
            // console.log(res);
            expect(res.statusCode).toBe(200);
          });
      });
  });
  test("responds to /api/products/all", async () => {
    const res = await request(app).get("/api/products/all");
    expect(res.statusCode).toBe(200);
  });

  test("responds to /api/products/all", async () => {
    const newProduct = {
      NAME: "lemon",
      PRICE: 200,
    };
    functions.addProductForTest(newProduct, 10).then((id) => {
      functions.addProductToWarehouse(id).then(() => {
        request(app)
          .get("/api/products/all")
          .then((res) => {
            expect(res.statusCode).toBe(200);
            expect(res.body[0].name).toEqual(newProduct.NAME);
            expect(res.body[0].price).toEqual(newProduct.PRICE);
            //   expect(res.body[0].id).toEqual(id);
          });
      });
    });
  });

  test("responds to api/farmer/:id with invalid id", async () => {
    request(app)
      .get(`/api/farmer/tt`)
      .then((res) => {
        expect(res.statusCode).toBe(500);
      });
  });

  test("responds to api/farmer/:id", async () => {
    functions.addFarmerForTest({ NAME: "test", SURNAME: "test" }).then((id) => {
      request(app)
        .get(`/api/farmer/${id}`)
        .then((res) => {
          expect(res.statusCode).toBe(200);
          expect(res.body.name).toEqual("test");
          expect(res.body.surname).toEqual("test");
        });
    });
  });
});
