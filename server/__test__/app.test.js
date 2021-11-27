const express = require("express");
const db = require("../dbTest");
const app = express();
const server = require("../app")(app, db);
const request = require("supertest");
const functions = require("./basicFunctions");

const initializeDB = () => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM product; DELETE FROM warehouse;";
    db.run(sql, [], (err) => {
      if (err) {
        reject(err);
        return;
      } else resolve();
    });
  });
};

beforeEach(async () => {
  await initializeDB();
});

afterAll(async () => {
  await initializeDB();
});
describe("Test api's", () => {
  test("responds to /api/products/all", async () => {
    const res = await request(app).get("/api/products/all");
    expect(res.statusCode).toBe(200);
  });

  test("responds to /api/products/all", async () => {
    const newProduct = {
      NAME: "apple",
      PRICE: 100,
    };
    functions.addProductForTest(newProduct, 10).then((id) => {
      functions.addProductToWarehouse(id).then(() => {
        request(app)
          .get("/api/products/all")
          .then((res) => {
            expect(res.statusCode).toBe(200);
          });
      });
    });
  });
});

/*
app.get("/api/products/all", async (req, res) => {
  try {
    //1) Get the products from the table
    const productsList = await employeeDAO.listProductsAll();
    res.status(200).json(productsList);
  } catch (err) {
    res.status(404).end();
  }
});

  test('responds to /hello/:name', async () => {
    const res = await request(app).get('/hello/jaxnode'); 
    expect(res.header['content-type']).toBe('text/html; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.text).toEqual('hello jaxnode!');
  });
 */
