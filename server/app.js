module.exports = function (app, db, testUser, bot) {
  const schedule = require("node-schedule");
  const employeeDAO = require("./Dao/employeeDBAccess"); // module for accessing the DB
  const farmerDAO = require("./Dao/farmerDAO"); //module for accessing db from farmer

  const nodemailer = require('nodemailer');
  const creds = require('./config');

  const bcrypt = require("bcrypt");
  /*TO DO: capire se usare un unico db con campo tipodiuser o diverse tabelle*/

  const { check, oneOf, validationResult } = require("express-validator");

  const express = require("express");
  const morgan = require("morgan"); // logging middleware
  const passport = require("passport");
  const LocalStrategy = require("passport-local").Strategy; // username+psw
  const session = require("express-session");
  const myUserDao = require("./Dao/userDao");
  const customerDao = require("./Dao/customerDao");
  const managerDao = require("./Dao/managerDAO");

  const userDao = require("./Dao/dbusers");

  if (!testUser) {
    bot.command("start", (ctx) => {
      myUserDao.addNewTelegramUser(db, ctx.chat.id);
      bot.telegram.sendMessage(
        ctx.chat.id,
        `Hello ${ctx.chat.first_name}! Welcome to SPG telegram bot.`,
        {}
      );
    });
  }

  var transport = {
    host: 'smtp.gmail.com', // e.g. smtp.gmail.com
    secure: false, // use SSL
    auth: {
      user: creds.USER,
      pass: creds.PASS
    },
    tls: {
      rejectUnauthorized: false
  }
  }
  
  var transporter = nodemailer.createTransport(transport)
  
  transporter.verify((error, success) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email setup completed!');
    }
  });

  function handleMail(emailAddr) {
    var text = "Your order has been confirmed!";
    var mail = {
      from: "spg.p13.polito@gmail.com",
      to: emailAddr,
      subject: 'Order confirmed',
  
      html: text
    }
  
    transporter.sendMail(mail, (err, data) => {
      if (err) {
        /*res.json({
          msg: 'fail'
        })*/
        console.log("Email not sent");
      } else {
        /*res.json({
          msg: 'success'
        })*/
        console.log("Email sent");
      }
    })
  }

  passport.use(
    new LocalStrategy(function (username, password, done) {
      userDao.getUser(db, username, password).then((user) => {
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
      .getUserById(db, id)
      .then((user) => {
        done(null, user);
      })
      .catch((err) => {
        done(err, null);
      });
  });
  //const app = express();
  //const port = 3001;
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

  // initialization
  app.use(passport.initialize());
  app.use(passport.session());

  const isLogged = (req, res, next) => {
    if (testUser) {
      return next();
    }
    if (req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({ error: "Not authenticated" });
  };

  const isEmployee = (req, res, next) => {
    if (testUser) {
      return next();
    }
    if (req.user.role == "shopemployee") {
      return next();
    }
    return res.status(401).json({ error: "Unauthorized action" });
  };

  const isFarmer = (req, res, next) => {
    if (testUser) {
      return next();
    }
    if (req.user.role == "farmer") {
      return next();
    }
    return res.status(401).json({ error: "Unauthorized action" });
  };

  const isManager = (req, res, next) => {
    if (testUser) {
      return next();
    }
    if (req.user.role == "manager") {
      return next();
    }
    return res.status(401).json({ error: "Unauthorized action" });
  };

  // custom middleware: check if a given request is coming from an authenticated user
  const isLoggedIn = (req, res, next) => {
    if (testUser) {
      return next();
    }
    if (req.isAuthenticated()) return next();

    return res.status(401).json({ error: "not authenticated" });
  };

  const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    // Format express-validate errors as strings
    return `${location}[${param}]: ${msg}`;
  };

  /* ############## USER API ############## */

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

  //Active session restore
  app.get("/api/sessions/current", (req, res) => {
    if (req.isAuthenticated()) {
      res.status(200).json(req.user);
    } else res.status(401).json({ error: "Unauthenticated user!" });
  });

  /* SERVER SIDE FOR THE STORIES NUMBER 1, 2, 3 */

  // GET /api/products/all
  app.get("/api/products/all", async (req, res) => {
    try {
      //1) Get the products from the table
      const productsList = await employeeDAO.listProductsAll(db);
      console.log(productsList);
      res.status(200).json(productsList);
    } catch (err) {
      console.log(err);
      res.status(404).end();
    }
  });

  app.get("/api/customers/get", async (req, res) => {
    try {
      const obj = await employeeDAO.getCustomers(db);
      res.status(200).json(obj);
    } catch (err) {
      res.status(404).json();
    }
  });
  // GET /api/farmer/:id
  app.get("/api/farmer/:id", async (req, res) => {
    try {
      //Get the farmer ID
      const farmerID = Number(req.params.id);

      //Check if it's an integer
      if (!Number.isInteger(farmerID)) {
        res.status(500).end();
      } else {
        //1) Get the farmer from the table
        const farmer = await employeeDAO.getFarmerById(db, farmerID);

        //devo gestire la reject (di dao.listProductsAll())! Uso try-check
        res.status(200).json(farmer);
      }
    } catch (err) {
      res.status(404).end();
    }
  });

  // GET /api/orders/all
  app.get("/api/orders/all", isLogged, isEmployee, async (req, res) => {
    try {
      //0) Create an empty array as an anwere
      const resultArray = [];

      //0) Get the orders from the table
      const orders = await employeeDAO.getOrderAll(db);

      //1) Then, for each order I need to get the orderitems
      for (let i = 0; i < orders.length; i++) {
        //Get the i-th order
        const orderid = orders[i].id;

        //Get the orderitems from the DB
        let items = await employeeDAO.getOrderItems(db, orderid);

        let username = await employeeDAO.getCustomerById(
          db,
          orders[i].customerid
        );

        //Create the order object
        const order = {
          id: orderid,
          customerid: orders[i].customerid,
          username: username,
          state: orders[i].state,
          delivery: orders[i].delivery,
          total: orders[i].total,
          products: items,
        };
        //Add it to the res array
        resultArray.push(order);
      }

      res.status(200).json(resultArray);
    } catch (err) {
      res.status(404).end();
    }
  });

   // GET product by id
   app.get("/api/product/:id", isLogged, isEmployee, async (req, res) => {
    try {
      const id = req.params.id;

      const obj = await employeeDAO.getProductById(db, id);

      res.status(200).json(obj);
    } catch(err) {
      res.status(404).end();
    }
   });

  // TODO : the customer if FOR NOW is passed in the request, for the client side we need to get it from the cookie, so we probably need another route!
  // NOTE : the route has an /employee in its path because we will need a /client route to take in account the login, the two route can't be the same, due to the fact that the eployee passes the client id as a parameter, while the client need to be recovered from the cookie

  // POST /api/order/employee
  app.post(
    "/api/order/employee",
    isLogged,
    isEmployee,
    [
      check("customerid").isNumeric().withMessage("customer id is incorrect"),
      check("state")
        .isString()
        .isLength({ min: 1 })
        .withMessage("state is incorrect"),
      check("delivery")
        .isString()
        .isLength({ min: 1 })
        .withMessage("delivery is incorrect"),
      check("total").isNumeric().withMessage("total is incorrect"),
      check("listitems").isArray().withMessage("listitems array is incorrect"),
      /* Check the parameters of the array */
      check("listitems.*.id")
        .isNumeric()
        .withMessage("listitems : productid field is incorrect"),
      check("listitems.*.quantity")
        .isNumeric()
        .withMessage("listitems : quantity field is incorrect"),
      check("listitems.*.price")
        .isNumeric()
        .withMessage("listitems : price field is incorrect"),
    ],
    async (req, res) => {
      //Check the result of the validation
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() }); //Converte in array gli errori
      }
      try {
        //1) We need to add the order to the clientorder tabel first
        const orderINST = {
          customerid: req.body.customerid,
          state: req.body.state,
          delivery: req.body.delivery,
          total: req.body.total,
          date: req.body.date,
          address: req.body.address,
        };

        //2) post on DB and get the new Order ID back
        const order_id = await employeeDAO.createClientOrder(db, orderINST);

        //3) now I have the Order ID; I need now to store the orderitems

        //3.1) Get items
        const itemArray = req.body.listitems;

        //Check the length
        if (itemArray.length > 0) {
          //Post them
          for (let i = 0; i < itemArray.length; i++) {
            const el = itemArray[i];

            const itemINST = {
              orderid: order_id,
              productid: el.id,
              quantity: el.quantity,
              price: el.price,
            };

            console.log(itemINST);

            //POST IT
            const id_item = await employeeDAO.createOrderItem(db, itemINST);
          }
        }

        res.status(200).json({ orderid: order_id }); //Manda indietro un json (meglio di send e basta, e' piu' sucuro che vada)
      } catch (err) {
        res.status(500).end(); //Mando errore!
      }
    }
  );

  // POST lost food
  app.post(
    "/api/lostfood",
    isLogged,
    isEmployee,
    [
      check("name")
        .isString()
        .isLength({ min: 1 })
        .withMessage("name is incorrect"),
        check("quantity").isNumeric().withMessage("quantity is incorrect"),
        check("productid").isNumeric().withMessage("quantity is incorrect"),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
      }
      try {
        let order = {
          product: req.body.name,
          quantity: req.body.quantity,
          date: req.body.date,
          month: req.body.month,
          productid: req.body.productid,
        }
        console.log("Order en app.js:")
        console.log(order);
        let result = await employeeDAO.postLostFood(db, order);
        return res.status(200).json(result);
      }
      catch (err) {
        return res
          .status(500)
          .json({ error: "DB error while posting lost food" });
      }
    }
  );

  // POST /api/order/customer
  app.post(
    "/api/order/customer",
    /*isLogged,*/
    [
      check("customerid").isNumeric().withMessage("Customer ID is incorrect"),
      check("state")
        .isString()
        .isLength({ min: 1 })
        .withMessage("State is incorrect"),
      check("delivery")
        .isString()
        .isLength({ min: 1 })
        .withMessage("Delivery is incorrect"),
      check("total").isNumeric().withMessage("Total is incorrect"),
      check("listitems").isArray().withMessage("Listitems array is incorrect"),
      /* Check the parameters of the array */
      check("listitems.*.id")
        .isNumeric()
        .withMessage("Listitems : Productid field is incorrect"),
      check("listitems.*.quantity")
        .isNumeric()
        .withMessage("Listitems : Quantity field is incorrect"),
      check("listitems.*.price")
        .isNumeric()
        .withMessage("Listitems : Price field is incorrect"),
    ],
    async (req, res) => {
      //Check the result of the validation
      const errors = validationResult(req);
      console.log("Errors in validation");
      console.log(errors);

      if (!errors.isEmpty()) {
        console.log("Errors 2");
        return res.status(422).json({ errors: errors.array() }); //Converte in array gli errori
      }

      try {
        //1) We need to add the order to the clientorder tabel first
        const orderINST = {
          customerid: req.body.customerid,
          state: req.body.state,
          delivery: req.body.delivery,
          total: req.body.total,
          date: req.body.date,
          address: req.body.address,
        };

        //2) post on DB and get the new Order ID back
        const order_id = await customerDao.createClientOrder(db, orderINST);

        //3) now I have the Order ID; I need now to store the orderitems

        //3.1) Get items
        const itemArray = req.body.listitems;

        //Check the length
        if (itemArray.length > 0) {
          //Post them
          for (let i = 0; i < itemArray.length; i++) {
            const el = itemArray[i];

            const itemINST = {
              orderid: order_id,
              productid: el.id,
              quantity: el.quantity,
              price: el.price,
            };

            //console.log(`item instance : ${itemINST}`);

            //POST IT
            const id_item = await employeeDAO.createOrderItem(db, itemINST);
          }
        }

        res.status(200).json({ orderid: order_id }); //Manda indietro un json (meglio di send e basta, e' piu' sucuro che vada)
      } catch (err) {
        res.status(500).end(); //Mando errore!
      }
    }
  );

  //SERVER SIDE FOR THE STORIES NUMBER 4-5-9
  //STORY NUMBER 4

  //api for handing out the order number <id>.
  // POST /api/orders/:id
  app.post(
    "/api/orders/:id/handOut",
    isLogged,
    isEmployee,
    [check("id").isInt()],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      try {
        const id = req.params.id;
        let result = await employeeDAO.handOutOrder(db, id);
        return res.status(200).json(result);
      } catch (err) {
        return res
          .status(500)
          .json({ error: "DB error while handing out order" });
      }
    }
  );

  app.post(
    "/api/orders/:id/reportLost",
    isLogged,
    isEmployee,
    [check("id").isInt()],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      try {
        const id = req.params.id;
        let result = await employeeDAO.lostOrderStatus(db, id);
        return res.status(200).json(result);
      } catch (err) {
        return res
          .status(500)
          .json({ error: "DB error while reporting order as lost" });
      }
    }
  );

  // STORY NUMBER 5
  app.get("/api/customers/all", isLogged, isEmployee, async (req, res) => {
    try {
      const productsList = await employeeDAO.getCustomers(db);
      res.status(200).json(productsList);
    } catch (err) {
      res.status(404).end();
    }
  });

  app.post(
    "/api/customers/wallet/:id/:value",
    isLogged,
    isEmployee,
    [check("id").isInt()],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      try {
        const id = req.params.id;
        const value = req.params.value;

        let result = await employeeDAO.updateCustomerWallet(db, id, value);
        return res.status(200).json(result);
      } catch (err) {
        console.log("44");
        return res.status(500).json({ error: "DB error when updating wallet" });
      }
    }
  );

  //STORY NUMBER 9
  //getting the list of products sold by a specific farmer
  // GET /api/farmer/:filter/products
  app.get("/api/farmer/:filter/products", isLogged, isFarmer, (req, res) => {
    // products of farmer can be also get through their name/surname
    const farmerId = parseInt(req.params.filter);
    if (Number.isNaN(farmerId)) {
      farmerDAO
        .getFarmerProductsByName(db, req.params.filter)
        .then((products) => {
          res.json(products);
        })
        .catch(() => res.status(500).end());
    } else {
      farmerDAO
        .getFarmerProducts(db, req.params.filter)
        .then((products) => {
          res.json(products);
        })
        .catch(() => res.status(500).end());
    }
  });

  //setting the expected amount of availability for a specific product
  //it's an insert inside the warehouse table
  //POST /api/warehouse
  app.post(
    "/api/warehouse",
    [
      //validation on product (which is the product id) and quantity. Both have to be integers
      check("product").isInt(),
      check("quantity").isInt(),
    ],
    async (req, res) => {
      const errors = validationResult(req); //looking for errors thrown by the validation
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() }); //unprocessable entity in case of errors

      const product = req.body;
      try {
        let result = await farmerDAO.addProductExpectedAmount(db, product);
        return res.status(200).json(result);
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          error: "DB error during the add/update of a product availability",
        });
      }
    }
  );

  // GET /api/username/present
  app.get(
    "/api/username/present/:id",
    isLogged,
    isEmployee,
    async (req, res) => {
      try {
        const username = req.params.id;

        console.log(username);

        const obj = await employeeDAO.isUsernamePresent(db, username);

        res.status(200).json(obj);
      } catch (err) {
        res.status(404).end();
      }
    }
  );

  // POST /api/customer
  app.post(
    "/api/customer",
    [
      check("name")
        .isString()
        .isLength({ min: 1 })
        .withMessage("customer name is incorrect"),
      check("surname")
        .isString()
        .isLength({ min: 1 })
        .withMessage("customer surname is incorrect"),
      check("username")
        .isString()
        .isLength({ min: 1 })
        .withMessage("customer username is incorrect"),
      check("password")
        .isString()
        .isLength({ min: 1 })
        .withMessage("customer password's hash is incorrect"),
    ],
    async (req, res) => {
      //Check the result of the validation
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() }); //Converte in array gli errori
      }

      try {
        //0) Convert the password into an hash
        const hashPassword = async (password, saltRounds = 10) => {
          try {
            // Generate a salt
            const salt = await bcrypt.genSalt(saltRounds);

            // Hash password
            return await bcrypt.hash(password, salt);
          } catch (error) {
            console.log(error);
          }

          // Return null if error
          return null;
        };

        const tmp_hash = await hashPassword(req.body.password);

        if (!tmp_hash.err) {
          //0) Create the object instance for the customer
          const customerINST = {
            name: req.body.name,
            surname: req.body.surname,
          };

          //2) post on DB and get the new Customer ID back
          const customer_id = await employeeDAO.createNewCustomer(
            db,
            customerINST
          );

          //3) create the new user instance
          const userINST = {
            userid: customer_id,
            username: req.body.username,
            hash: tmp_hash,
            role: "customer",
          };

          //4) Post it on the DB
          const user_id = await employeeDAO.createNewUser(db, userINST);

          res.status(200).json({ userid: user_id });
        } else {
          res.status(500).end();
        }
      } catch (err) {
        res.status(500).end();
      }
    }
  );

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
    myUserDao
      .checkIfUserNotExists(db, req.body.username)
      .then(() => {
        myUserDao
          .addNewUser(db, req.body, req.body.role)
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

  app.post("/api/notifyTime", (req, res) => {
    new Promise(async (resolve, reject) => {
      const users = await myUserDao.getAllTelegramUsers(db);
      users.forEach((id) => {
        console.log(id);
        bot.telegram.sendMessage(
          id,
          "** The updated list of available products is available **"
        );
      });
      resolve();
    })
      .then(() => {
        res.status(200).json();
      })
      .catch((err) => {
        res.status(500).end();
      });
  });
  /*
  const j = schedule.scheduleJob(
    { dayOfWeek: 6, hour: 9, minute: 0 },
    async () => {
      const users = await myUserDao.getAllTelegramUsers(db);
      users.forEach((id) => {
        console.log(id);
        bot.telegram.sendMessage(
          id,
          "** The updated list of available products is available **"
        );
      });
    }
  );
*/
  app.get("/api/customers/:id", isLoggedIn, (req, res) => {
    // shoud we check the role of the requester?  (req.user.role)  v
    customerDao
      .getCustomerByUserId(db, req.params.id)
      .then((customer) => {
        res.status(200).json(customer);
      })
      .catch((error) => {
        res.status(error.code).json(error);
      });
  });

  /* END of STORIES NUMBER 6, 7, 8 */

  /**SERVER SIDE FOR STORY 10 */
  // this GET is used by employees to get information about the orders with a total > walletBalance of the customer who placed it
  // GET /api/orders/insufficientWallet
  app.get(
    "/api/orders/insufficientWallet",
    isLogged,
    isEmployee,
    async (req, res) => {
      try {
        const orders = await employeeDAO.getOrderAll(db); //get all the orders from the db

        //get all customers info
        const customers = await employeeDAO.getCustomers(db);

        let resultArray = orders.map((order) => {
          let customer = customers.find(
            (customer) => customer.id === order.customerid
          );
          return {
            id: order.id,
            customerid: order.customerid,
            state: order.state,
            delivery: order.delivery,
            total: order.total,
            customerName: customer.name,
            customerSurname: customer.surname,
            customerUsername: customer.username,
            customerWallet: customer.wallet,
          };
        });
        resultArray = resultArray.filter(
          (order) => order.total > order.customerWallet
        );
        res.status(200).json(resultArray);
      } catch (err) {
        res.status(404).end();
      }
    }
  );

  //STORY N. 14
  //Getting all orders for a specific farmer given its id
  //GET /api/farmerOrders
  app.get("/api/farmerOrders/:id", isLogged, isFarmer, async (req, res) => {
    try {
      //Create an array that will contain the result
      const result = [];

      //Get orders for the specified farmer given its id
      const orders = await farmerDAO.getFarmerOrderIds(db, req.params.id);

      //For each order get the quantity and name of the product
      for (let i = 0; i < orders.length; i++) {
        const products = await farmerDAO.getOrdersInfo(
          db,
          orders[i].id,
          req.params.id
        );

        result.push({
          id: orders[i].id,
          status: orders[i].status,
          products: products,
        });
      }

      res.status(200).json(result);
    } catch (err) {
      res.status(404).end();
    }
  });

  app.post("/api/confirmOrder/", [check("id").isInt()], async (req, res) => {
    const errors = validationResult(req); //looking for errors thrown by the validation
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() }); //unprocessable entity in case of errors

    const id = req.body.id;
    try {
      let result = await farmerDAO.confirmOrder(db, id);
      let customer = await farmerDAO.getCustomerMail(db, id);
      handleMail(customer);
      return res.status(200).json(result);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        error: "DB error during the update of order status",
      });
    }
  });

  //STORY N.15
  //Getting all farmer orders, along with their info (i.e. all the items they contain)
  // GET /api/farmerOrders
  app.get("/api/farmerOrders", isLogged, isManager, async (req, res) => {
    try {
      //0) Create an empty array as an answer
      const resultArray = [];

      //0) Get the orders from the table
      const orders = await farmerDAO.getFarmerOrders(db);

      //1) Then, for each order I need to get the farmerOrderItems
      for (let i = 0; i < orders.length; i++) {
        //Get the i-th order id
        let orderid = orders[i].id;

        //Get the orderitems from the DB
        let items = await farmerDAO.getFarmerOrderItems(db, orderid);

        //Create the order object
        let order = {
          id: orderid,
          farmerid: orders[i].farmerid,
          farmerName: orders[i].name,
          farmerSurname: orders[i].surname,
          state: orders[i].state,
          total: orders[i].total,
          time: orders[i].datetime,
          listitems: items,
        };
        //Add it to the res array
        resultArray.push(order);
      }
      res.status(200).json(resultArray);
    } catch (err) {
      res.status(500).end();
    }
  });

  //ACKNOWLEDGE DELIVERY -> try to change the state of the order id from pending to delivered
  app.post(
    "/api/farmerOrders/:id/ack",
    isLogged,
    isManager,
    [
      check("id").isNumeric().withMessage("farmer order id is incorrect"),
      check("newState").isString().equals("delivered"),
    ],
    async (req, res) => {
      // check validity of data
      // check if username does not exist
      // add to corresponding table according to the role and then get userid and then add to users table
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({
          errors: errors.array(),
        });
      }
      const orderid = req.body.id;
      if (orderid != req.params.id) {
        res.status(422).json({
          msg: "ID in params and ID inside the body of the request don't match",
        });
        return;
      }
      //request to the db
      try {
        let result = await farmerDAO.ackDeliveryFarmerOrder(db, orderid);
        res.status(200).json(result);
      } catch (err) {
        if (err.code === "404") res.status(404).end();
        else res.status(500).end();
      }
    }
  );

  // Getting all the information required for the manager reports
  // GET /api/managerReports
  app.get("/api/managerReports", isLogged, isManager, async (req, res) => {
    try {
      // Create an empty array as an answer
      const reportArray = [];

      // Get the reports and all the food that has been lost (i.e. not picked up)
      const reports = await managerDao.getReports(db);
      const lostFood = await managerDao.getLostFood(db);

      // For each report, an entry is added to reportArray
      // To each report, the correct lost food must be added (dates must match)
      for (let i = 0; i < reports.length; i++) {
        let currentReport = reports[i];
        let initialDate = currentReport.initialDate;
        let finalDate = currentReport.finalDate;
        let reportForArray;
        let foodDictionary = {};

        for (let j = 0; j < lostFood.length; j++) {
          let currentProduct = lostFood[j];
          let foodDate = new Date(lostFood[j].date);
          var d1 = new Date(initialDate);
          var d2 = new Date(finalDate);

          if (foodDate <= d2 && foodDate >= d1) {
            // If it is already there, just add it
            let currentNumber = 0;
            if (currentProduct.product in foodDictionary) {
              currentNumber = foodDictionary[currentProduct.product];
            }
            foodDictionary[currentProduct.product] =
              currentProduct.quantity + currentNumber;
          }
        }

        // If report is of type week
        if (currentReport.type == 0) {
          reportForArray = {
            type: 0,
            weekStartDate: currentReport.initialDate,
            weekEndDate: currentReport.finalDate,
            lostFood: foodDictionary,
          };
        }
        // Else, report is for the entire month
        else if (currentReport.type == 1) {
          let year = currentReport.initialDate.substring(0, 4);
          let month = currentReport.initialDate.substring(5, 7);
          reportForArray = {
            type: 1,
            month: month,
            year: year,
            lostFood: foodDictionary,
          };
        }

        //Add it to the report array
        reportArray.push(reportForArray);
      }
      res.status(200).json(reportArray);
    } catch (err) {
      res.status(500).end();
    }
  });

  app.get("/api/:username", async (req, res) => {
    try {
      const id = await userDao.getId(db, req.params.username);
      res.status(200).json(id);
    } catch (err) {
      res.status(404).end();
    }
  });
};
