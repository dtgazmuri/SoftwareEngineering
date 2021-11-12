/*TO DO: capire se usare un unico db con campo tipodiuser o diverse tabelle*/

const employeeDAO = require("./employeeDBAccess"); // module for accessing the DB

const { check, oneOf, validationResult } = require("express-validator");

const express = require("express");
const morgan = require("morgan"); // logging middleware
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy; // username+psw
const session = require("express-session");
const userDao = require("./userDao");
const customerDao = require("./customerDao");

passport.use(
  new LocalStrategy(function (username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, {
          message: "Incorrect username and/or password.",
        });
      return done(null, user);
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  userDao
    .getUserById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
});
const app = express();
const port = 3001;
app.use(morgan("dev"));
app.use(express.json());

// set up the session
app.use(
  session({
    secret: "- secret phrase -",
    resave: false,
    saveUninitialized: false,
  })
);

// inizializzazione
app.use(passport.initialize());
app.use(passport.session());

const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  // Format express-validate errors as strings
  return `${location}[${param}]: ${msg}`;
};
/* ############## USER API ############## */

// Login
app.post("/api/sessions", function (req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).json(info);
    }
    // resolve, perform the login
    req.login(user, (err) => {
      if (err) return next(err);

      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUser()
      return res.json(req.user);
    });
  })(req, res, next);
});

//Logout
app.delete("/api/sessions/current", (req, res) => {
  req.logout();
  res.end();
});

//Recupero sessione
app.get("/api/sessions/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else res.status(401).json({ error: "Unauthenticated user!" });
});

/* SERVER SIDE FOR THE STORIES NUMBER 1, 2, 3 */

// GET /api/products/all
app.get("/api/products/all", async (req, res) => {
  //Devo aspettare che la promise sia risolta! Metto await
  try {
    //1) Get the products from the table
    const productsList = await employeeDAO.listProductsAll();

    //devo gestire la reject (di dao.listProductsAll())! Uso try-check
    res.status(200).json(productsList); //Manda indietro un json (meglio di send e basta, e' piu' sucuro che vada)
  } catch (err) {
    res.status(404).end(); //Mando errore!
  }
});

// GET /api/farmer/:id
app.get("/api/farmer/:id", async (req, res) => {
  //Devo aspettare che la promise sia risolta! Metto await
  try {
    //Get the farmer ID
    const farmerID = Number(req.params.id);

    //Check if it's an integer
    if (!Number.isInteger(farmerID)) {
      res.status(500).end(); //Mando errore!
    } else {
      //1) Get the farmer from the table
      const farmer = await employeeDAO.getFarmerById(farmerID);

      //devo gestire la reject (di dao.listProductsAll())! Uso try-check
      res.status(200).json(farmer); //Manda indietro un json (meglio di send e basta, e' piu' sucuro che vada)
    }
  } catch (err) {
    res.status(404).end(); //Mando errore!
  }
});

//TODO : all those function need to have the user logged in, and we need to check the "type" of user currently logged in to do it!

// GET /api/orders/all
app.get("/api/orders/all", async (req, res) => {
  //Devo aspettare che la promise sia risolta! Metto await
  try {
    //Prendo la risposta dal server

    //0) Create an empty array as an anwere
    const resultArray = [];

    //0) Get the orders from the table
    const orders = await employeeDAO.getOrderAll();

    console.log(orders);

    //1) Then, for each order I need to get the orderitems!
    let i = 0;
    for (i = 0; i < orders.length; i++) {
      //Get the i-th order
      const orderid = orders[i].id;

      //Get the orderitems from the DB
      let items = await employeeDAO.getOrderItems(orderid);

      //Create the order object
      const order = {
        id: orderid,
        customerid: orders[i].customerid,
        state: orders[i].state,
        delivery: orders[i].delivery,
        total: orders[i].total,
        listitems: items,
      };

      //Add it to the res array
      resultArray.push(order);
    }

    //devo gestire la reject (di dao.listCourses())! Uso try-check
    res.status(200).json(resultArray); //Manda indietro un json (meglio di send e basta, e' piu' sucuro che vada)
  } catch (err) {
    res.status(404).end(); //Mando errore!
  }
});

//PUSH /api/order

/* END */

/* SERVER SIDE FOR THE STORIES NUMBER 6, 7, 8 */

//registration
const registerValidation = [
  check("username")
    .exists()
    .withMessage("username is required")
    .isEmail()
    .withMessage("username must be email"),
  check("password").exists().withMessage("password is required"),
  check("role")
    .exists()
    .withMessage("role is required")
    .isIn(["customer", "shopemployee"]),
  check("name").exists().withMessage("name is required").isLength({
    min: 1,
  }),
  check("surname").exists().withMessage("surname is required").isLength({
    min: 1,
  }),
];

app.post("/api/users/registration", registerValidation, (req, res) => {
  // check validity of data
  // check if username does not exist
  // add to corresponding table according to the role and then get userid and then add to users table

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  userDao
    .checkIfUserNotExists(req.body.username)
    .then(() => {
      console.log("checkIfUserNotExists passed");
      userDao
        .addNewUser(req.body, req.body.role)
        .then(() => {
          res.status(201).json("new user created");
        })
        .catch((error) => {
          res.status(500).json(error);
        });
    })
    .catch((error) => {
      res.status(error.code).json(error.msg);
    });
});

app.get(
  "/api/customers/:id",
  /*isLoggedIn ,*/ (req, res) => {
    // shoud we check the role of the requester?  (req.user.role)  v
    customerDao
      .getCustomerByUserId(req.params.id)
      .then((cusomer) => {
        res.status(200).json(cusomer);
      })
      .catch((error) => {
        res.status(error.code).json(error);
      });
  }
);
/* END of STORIES NUMBER 6, 7, 8 */

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
