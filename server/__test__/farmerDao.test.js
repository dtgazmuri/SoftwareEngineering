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

beforeAll(async () => {
  await initializeDB();
});

afterAll(async () => {
  await initializeDB();
});

describe("test farmerDao functions", () => {
  test("test getFarmerProducts", async () => {
    return farmerDao.getFarmerProducts(db, 1).then((data) => {
      expect(data).toEqual([]);
    });
  });
});
