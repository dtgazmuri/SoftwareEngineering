const customerDao = require("../Dao/customerDao");
const db = require("../dbTest");
const functions = require("./basicFunctions");

const initializeDB = () => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM customer;";
    db.run(sql, [], (err) => {
      if (err) {
        reject(err);
        return;
      } else resolve();
    });
  });
};

beforeAll(async () => {
  await initializeDB();
});

afterAll(async () => {
  await initializeDB();
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
