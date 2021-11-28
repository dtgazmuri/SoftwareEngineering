const express = require("express");
const db = require("../dbTest");
const app = express();
const server = require("../app")(app, db);
const request = require("supertest");
const functions = require("./basicFunctions");
const farmerDao = require("../Dao/farmerDAO");
const userDao = require("../Dao/userDao");
const customerDao = require("../Dao/customerDao");

const initializeDB = () => {
  return new Promise((resolve, reject) => {
    const sql =
      "DELETE FROM users; DELETE FROM customer; DELETE FROM shopemployee; DELETE FROM product; DELETE FROM farmer; DELETE FROM warehouse;";
    db.run(sql, [], (err) => {
      if (err) {
        reject(err);
        return;
      } else resolve();
    });
  });
};

beforeEach(() => {
  initializeDB();
});

afterAll(() => {
  // await initializeDB();
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
        functions.addProductForTest(newProduct, farmerId).then((productId) => {
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

describe("Test api's", () => {
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
  /*
  test("responds to /api/orders/all", async () => {
    request(app)
      .get("/api/orders/all")
      .then((res) => {
        expect(res.statusCode).toBe(200);
      });
  });
  */
});
