const farmerDao = require("../Dao/farmerDAO");
const db = require("../dbTest");

const initializeDB = () => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM product; DELETE FROM farmer;";
    db.run(sql, [], (err) => {
      if (err) {
        reject(err);
        return;
      } else resolve();
    });
  });
};

const addFarmerForTest = (farmer) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO farmer(NAME, SURNAME) VALUES (?, ?)";
    db.run(sql, [farmer.NAME, farmer.SURNAME], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

const addProductForTest = (product, farmerId) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO product(NAME, FARMER, PRICE) VALUES (?, ?, ?)";
    db.run(sql, [product.NAME, farmerId, product.PRICE], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

beforeAll(async () => {
  await initializeDB();
});

afterAll(async () => {
  await initializeDB();
});

describe("test farmerDao functions", () => {
  test("test getFarmerProducts while farmer does not exist", async () => {
    return farmerDao.getFarmerProducts(db, 1).then((data) => {
      expect(data).toEqual([]);
    });
  });

  test("test getFarmerProducts", async () => {
    addFarmerForTest({ NAME: "test", SURNAME: "test" }).then((farmerId) => {
      const product = {
        NAME: "apple",
        PRICE: 100,
      };
      addProductForTest(product, farmerId).then((productId) => {
        return farmerDao.getFarmerProducts(db, farmerId).then((data) => {
          expect(data).toEqual([
            {
              id: productId,
              name: product.NAME,
              price: product.PRICE,
            },
          ]);
        });
      });
    });
  });
});
