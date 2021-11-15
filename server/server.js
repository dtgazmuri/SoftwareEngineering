const userDao = require('./dbusers.js');

const employeeDAO = require('./employeeDBAccess'); // module for accessing the DB

const bcrypt = require('bcrypt');

const { check, validationResult } = require('express-validator'); // validation middleware
const express = require('express');
const morgan = require('morgan'); // logging middleware
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; // username+psw
const session = require('express-session');

passport.use(new LocalStrategy(
  function (username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Incorrect username and/or password.' });
      return done(null, user);
    })
  }
));


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  userDao.getUserById(id)
    .then(user => {
      done(null, user);
    }).catch(err => {
      done(err, null);
    });
});
const app = express();
const port = 3001;
app.use(morgan('dev'));
app.use(express.json());


// set up the session
app.use(session({
  secret: '- secret phrase -',
  resave: false,
  saveUninitialized: false
}));

// inizializzazione
app.use(passport.initialize());
app.use(passport.session());



const isLogged = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Not authenticated' });
}


const isEmployee = (req, res, next) => {
  if (req.user.role == "shopemployee") {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized action' });
}



app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).json(info);
    }
    // resolve, perform the login
    req.login(user, (err) => {
      if (err)
        return next(err);

      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUser()
      return res.json(req.user);
    });
  })(req, res, next);
});

//Logout
app.delete('/api/sessions/current', (req, res) => {
  req.logout();
  res.end();
});

//Active session restore
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  else
    res.status(401).json({ error: 'Unauthenticated user!' });;
});





/* SERVER SIDE FOR THE STORIES NUMBER 1, 2, 3 */

// GET /api/products/all
app.get('/api/products/all', async (req, res) => {
  try {

    //1) Get the products from the table
    const productsList = await employeeDAO.listProductsAll();
    res.status(200).json(productsList);
  }
  catch (err) {
    res.status(404).end();
  }
});

// GET /api/farmer/:id
app.get('/api/farmer/:id', async (req, res) => {

  try {

    //Get the farmer ID
    const farmerID = Number(req.params.id);

    //Check if it's an integer
    if (!Number.isInteger(farmerID)) {
      res.status(500).end();  
    }
    else {

      //1) Get the farmer from the table
      const farmer = await employeeDAO.getFarmerById(farmerID);

      //devo gestire la reject (di dao.listProductsAll())! Uso try-check
      res.status(200).json(farmer);  
    }
  }
  catch (err) {
    res.status(404).end();  
  }
});

// GET /api/orders/all
app.get('/api/orders/all', isLogged, isEmployee, async (req, res) => {

  try {
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
      const order = ({ id: orderid, customerid: orders[i].customerid, state: orders[i].state, delivery: orders[i].delivery, total: orders[i].total, listitems: items });

      //Add it to the res array
      resultArray.push(order);

    }

    res.status(200).json(resultArray);
  }
  catch (err) {
    res.status(404).end();
  }
});


// TODO : the customer if FOR NOW is passed in the request, for the client side we need to get it from the cookie, so we probably need another route!
// NOTE : the route has an /employee in its path because we will need a /client route to take in account the login, the two route can't be the same, due to the fact that the eployee passes the client id as a parameter, while the client need to be recovered from the cookie
// POST /api/order/employee
app.post('/api/order/employee', isLogged, isEmployee, [
  check('customerid').isNumeric().withMessage("customer id is incorrect"),
  check('state').isString().isLength({ min: 1 }).withMessage("state is incorrect"),
  check('delivery').isString().isLength({ min: 1 }).withMessage("delivery is incorrect"),
  check('total').isNumeric().withMessage("total is incorrect"),
  check('listitems').isArray().withMessage("listitems array is incorrect"),
  /* Check the parameters of the array */
  check('listitems.*.id').isNumeric().withMessage("listitems : productid field is incorrect"),
  check('listitems.*.quantity').isNumeric().withMessage("listitems : quantity field is incorrect"),
  check('listitems.*.price').isNumeric().withMessage("listitems : price field is incorrect")
],
  async (req, res) => {

    //Check the result of the validation
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() }); //Converte in array gli errori
    }


    try {

      //1) We need to add the order to the clientorder tabel first
      const orderINST = { customerid: req.body.customerid, state: req.body.state, delivery: req.body.delivery, total: req.body.total };

      //2) post on DB and get the new Order ID back
      const order_id = await employeeDAO.createClientOrder(orderINST);

      //3) now I have the Order ID; I need now to store the orderitems

      //3.1) Get items
      const itemArray = req.body.listitems;

      //Check the length
      let i = 0;
      if (itemArray.length > 0) {
        //Post them
        for (i = 0; i < itemArray.length; i++) {
          const el = itemArray[i];

          const itemINST = { orderid: order_id, productid: el.id, quantity: el.quantity, price: el.price };

          console.log(`item instance : ${itemINST}`);

          //POST IT
          const id_item = await employeeDAO.createOrderItem(itemINST);

        }
      }


      res.status(200).json({ orderid: order_id });  
    }
    catch (err) {
      res.status(500).end();  
    }
  });


// GET /api/username/present
app.get('/api/username/present/:id', async (req, res) => {

  try {

    const username = req.params.id;

    console.log(username);

    const obj = await employeeDAO.isUsernamePresent(username);

    res.status(200).json(obj);  
  }
  catch (err) {
    res.status(404).end();  
  }
});

app.get('/api/customerlist', isLogged, isEmployee, async (req, res) => {

  try {
    const obj = await employeeDAO.getCustomers();
    res.status(200).json(obj); 
  }
  catch (err) {
    res.status(404).end();
  }
});

// POST /api/customer
app.post('/api/customer', [
  check('name').isString().isLength({ min: 1 }).withMessage("customer name is incorrect"),
  check('surname').isString().isLength({ min: 1 }).withMessage("customer surname is incorrect"),
  check('username').isString().isLength({ min: 1 }).withMessage("customer username is incorrect"),
  check('password').isString().isLength({ min: 1 }).withMessage("customer password's hash is incorrect"),
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

      if (!tmp_hash.err){

        //0) Create the object instance for the customer
        const customerINST = { name: req.body.name, surname: req.body.surname }

        //2) post on DB and get the new Customer ID back
        const customer_id = await employeeDAO.createNewCustomer(customerINST);

        //3) create the new user instance
        const userINST = { userid: customer_id, username: req.body.username, hash: tmp_hash, role: "customer" }

        //4) Post it on the DB
        const user_id = await employeeDAO.createNewUser(userINST);

        res.status(200).json({ userid: user_id });  

      }
      else{
        res.status(500).end();
      }
    }
    catch (err) {
      res.status(500).end();
    }
  });



/* END */




app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
}
)
