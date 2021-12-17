// This file contains SQL querries for the manager report requests


// GET all reports
exports.getReports = (db) => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM reports";
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const reports = rows.map((e) => ({
          id: e.ID,
          type: e.TYPE,
          initialDate: e.INITIALDATE,
          finalDate: e.FINALDATE,
        }));
        resolve(reports);
      });
    });
};

// GET all the lost food
exports.getLostFood = (db) => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM lostfood";
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const lostFood = rows.map((e) => ({
          id: e.ID,
          product: e.PRODUCT,
          quantity: e.QUANTITY,
          date: e.DATE,
          month: e.MONTH,
        }));
        resolve(lostFood);
      });
    });
};