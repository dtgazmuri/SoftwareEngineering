const userDao = require("../Dao/userDao");
const db = require("../dbTest");
const functions = require("./basicFunctions");

const initializeDB = () => {
  return new Promise((resolve, reject) => {
    const sql =
      "DELETE FROM users; DELETE FROM customer; DELETE FROM shopemployee;";
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
