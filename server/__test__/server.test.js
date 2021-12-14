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
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
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
});
