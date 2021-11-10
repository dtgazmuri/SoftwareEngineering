/* This file contain the SQL query for the DB for the employee requests */

const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('se2.db', (err) => {
  if(err) throw err;
});



// get all products (with the werehouse quantity)
exports.listProductsAll = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM product, warehouse WHERE product.ID = warehouse.PRODUCT';

    //const sql = 'SELECT * FROM product, warehouse WHERE product.ID = warehouse.PRODUCT';


    console.log("here");

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      
      console.log(rows);
      
      const products = rows.map((e) => ({ id: e.ID, name: e.NAME, farmerid: e.FARMER, price: e.PRICE, quantity: e.QUANTITY }));
      resolve(products);
    });
  });
};

/*
// get the surveys of the given administrator
exports.listSurveys = (admid) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM survey WHERE administratorid=?';
    db.all(sql, [admid], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const surveys = rows.map((e) => ({ idQ: e.idQ, title: e.title }));
      resolve(surveys);
    });
  });
};

// get the surveys with the given id
exports.getSurveysById = (ids) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM survey WHERE idQ=?';
    db.all(sql, [ids], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const surveys = rows.map((e) => ({ administratorid: e.administratorid }));
      resolve(surveys);
    });
  });
};

// get the user who compiles a given survey
exports.listCompilations = (ids) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT user.idU, user.name FROM user, userwhocompile WHERE userwhocompile.idQ=? AND user.idU = userwhocompile.idU';
    db.all(sql, [ids], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const surveys = rows.map((e) => ({ idU: e.idU, name: e.name }));
      resolve(surveys);
    });
  });
};


// get open questions
exports.listOpenQuestions = (surveyid) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM openquestion WHERE surveyid=?';
    db.all(sql, [surveyid], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const opq = rows.map((e) => ({ idDA:e.idDA, text:e.text, mandatory:e.mandatory, ordernum:e.ordernum }));
      resolve(opq);
    });
  });
};

// get closed questions
exports.listClosedQuestions = (surveyid) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM closedquestion WHERE surveyid = ?';
    db.all(sql, [surveyid], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const clq = rows.map((e) => ({ idDC:e.idDC, text:e.text, min:e.min, max:e.max, ordernum:e.ordernum }));
      resolve(clq);
    });
  });
};

// get closed answers
exports.listClosedAnswers = (idDC) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM closedanswer WHERE questionid = ?';
    db.all(sql, [idDC], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const clq = rows.map((e) => ({ idR:e.idR, text:e.text }));
      resolve(clq);
    });
  });
};

//Add a new Survey
exports.createSurvey = (survey) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO survey(title, administratorid) VALUES(?, ?)';
    db.run(sql, [survey.title, survey.administratorid], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

//Add a new Open Question
exports.createOpenQuestion = (openQ) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO openquestion(surveyid, text, mandatory, ordernum) VALUES(?, ?, ?, ?)';

    //console.log(`open question log : ${openQ.surveyid}, ${openQ.text}, ${openQ.mandatory}, ${openQ.ordernum}`);

    //{surveyid:idQ, text:el.text, mandatory:el.mandatory, ordernum:el.ordernum}; 
    db.run(sql, [openQ.surveyid, openQ.text, openQ.mandatory, openQ.ordernum], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};


//Add a new Closed Question
exports.createClosedQuestion = (closedQ) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO closedquestion(surveyid, text, min, max, ordernum) VALUES(?, ?, ?, ?, ?)';

    //{surveyid:idQ, text:el.text, mandatory:el.mandatory, ordernum:el.ordernum}; 
    db.run(sql, [closedQ.surveyid, closedQ.text, closedQ.min, closedQ.max, closedQ.ordernum], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

//Add a new Closed Answer
exports.createClosedAnswer = (closedA) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO closedanswer(questionid, text) VALUES(?, ?)';

    //questionid:idDC, text:ans.text
    db.run(sql, [closedA.questionid, closedA.text], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};



// get the open answers by user ID (that's actually the compilation id)
exports.getUserOpenAnswers = (userid) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM useransweropen WHERE idU=?';
    db.all(sql, [userid], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const surveys = rows.map((e) => ({ idDA: e.idA, text: e.text }));
      resolve(surveys);
    });
  });
};

// get the closed answers by user ID  (that's actually the compilation id)
exports.getUserClosedAnswers = (userid) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM useranswerclosed WHERE idU=?';
    db.all(sql, [userid], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const surveys = rows.map((e) => ({ idR: e.idR, selected: e.selected }));
      resolve(surveys);
    });
  });
};


//ADD ANSWERS FUNCTIONS

//Add a new User
exports.addUser = (name) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO user(name) VALUES(?)';
    db.run(sql, [name], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

//Add a new Compilation
exports.addCompilation = (userID, sid) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO userwhocompile(idQ, idU) VALUES(?, ?)';
    db.run(sql, [sid, userID], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

//ADD THE ANSWERS

//Add a new Open Answer
exports.addOpenAnswer = (openAns) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO useransweropen(idU, idA, text) VALUES(?, ?, ?)';
    db.run(sql, [openAns.userID, openAns.idDA, openAns.text], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

//Add a new Closed Answer
exports.addClosedAnswer = (closedAns) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO useranswerclosed(idU, idR, selected) VALUES(?, ?, ?)';
    db.run(sql, [closedAns.userID, closedAns.idR, closedAns.selected], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};



/*
// get the course identified by {code}
exports.getCourse = (code) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM course WHERE code=?';
    db.get(sql, [code], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row == undefined) {
        resolve({error: 'Course not found.'});
      } else {
        const course = { code: row.code, name: row.name, CFU: row.CFU };
        resolve(course);
      }
    });
  });
};

// get all exams
exports.listExams = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT coursecode, score, date FROM exam';

    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      const exams = rows.map((e) => (
        {
          code: e.coursecode,
          score: e.score,
          date: e.date,
        }));

      resolve(exams);
    });
  });
};

// add a new exam
exports.createExam = (exam) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO exam(coursecode, date, score) VALUES(?, DATE(?), ?)';
    db.run(sql, [exam.code, exam.date, exam.score], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

// update an existing exam
exports.updateExam = (exam) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE exam SET date=DATE(?), score=? WHERE coursecode = ?';
    db.run(sql, [exam.date, exam.score, exam.code], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

// delete an existing exam
exports.deleteExam = (course_code) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM exam WHERE coursecode = ?';
    db.run(sql, [course_code], (err) => {
      if (err) {
        reject(err);
        return;
      } else
        resolve(null);
    });
  });
}
*/