const farmerDao = require("../Dao/farmerDAO");
const db = require("../dbTest");

const initializeDB = () => {
  return new Promise((resolve, reject) => {
    const sql =
      "DELETE FROM product; DELETE FROM farmer; DELETE FROM warehouse;";
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

beforeEach(async () => {
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
      const newProduct = {
        NAME: "apple",
        PRICE: 100,
      };
      addProductForTest(newProduct, farmerId).then((productId) => {
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
