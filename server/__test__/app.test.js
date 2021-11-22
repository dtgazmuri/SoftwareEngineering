const express = require("express");
const db = require("../db");
const app = express();
const server = require("../app")(app, db);
const request = require("supertest");

//jest.mock("../db");

describe("Test api's", () => {
  beforeAll(() => {
    /* db.run(`DELETE FROM product`, function (err) {
      if (err) {
        return console.error(err.message);
      }
    }); */
  });

  test("responds to /api/products/all", async () => {
    const res = await request(app).get("/api/products/all");
    expect(res.statusCode).toBe(200);
    //expect(res.body[0]).toEqual([]);
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
