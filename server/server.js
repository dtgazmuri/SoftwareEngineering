

/*TO DO: capire se usare un unico db con campo tipodiuser o diverse tabelle*/
const userDao = "";


const employeeDAO = require('./employeeDBAccess'); // module for accessing the DB
const farmerDAO = require('./farmerDAO'); //module for accessing db from farmer


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


const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  // Format express-validate errors as strings
  return `${location}[${param}]: ${msg}`;
};
/* ############## USER API ############## */

// Login
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

//Recupero sessione
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

  //Devo aspettare che la promise sia risolta! Metto await
  try {

    //1) Get the products from the table
    const productsList = await employeeDAO.listProductsAll();

    //devo gestire la reject (di dao.listProductsAll())! Uso try-check
    res.status(200).json(productsList);  //Manda indietro un json (meglio di send e basta, e' piu' sucuro che vada)
  }
  catch (err) {
    res.status(404).end();  //Mando errore!
  }
});

// GET /api/farmer/:id
app.get('/api/farmer/:id', async (req, res) => {

  //Devo aspettare che la promise sia risolta! Metto await
  try {

    //Get the farmer ID
    const farmerID = Number(req.params.id);

    //Check if it's an integer
    if (!Number.isInteger(farmerID)){
      res.status(500).end();  //Mando errore!
    }
    else{


      //1) Get the farmer from the table
      const farmer = await employeeDAO.getFarmerById(farmerID);

      //devo gestire la reject (di dao.listProductsAll())! Uso try-check
      res.status(200).json(farmer);  //Manda indietro un json (meglio di send e basta, e' piu' sucuro che vada)
    }
  }
  catch (err) {
    res.status(404).end();  //Mando errore!
  }
});



//TODO : all those function need to have the user logged in, and we need to check the "type" of user currently logged in to do it!

// GET /api/orders/all
app.get('/api/orders/all', async (req, res) => {

  //Devo aspettare che la promise sia risolta! Metto await
  try {
      //Prendo la risposta dal server

      //0) Create an empty array as an anwere
      const resultArray = [];

      //0) Get the orders from the table
      const orders = await employeeDAO.getOrderAll();

      //1) Then, for each order I need to get the orderitems!
      let i = 0;
      for (i = 0; i < orders.length; i++) {

          //Get the i-th order
          const orderid = orders[i].id;

          //Get the orderitems from the DB
          let items = await employeeDAO.getOrderItems(orderid);

          //Create the order object
          const order = ({ id: orderid, customerid: orders[i].customerid, state: orders[i].state, delivery: orders[i].delivery, total: orders[i].total, listitems: items});

          //Add it to the res array
          resultArray.push(order);

      }

      //devo gestire la reject (di dao.listCourses())! Uso try-check
      res.status(200).json(resultArray);  //Manda indietro un json (meglio di send e basta, e' piu' sucuro che vada)
  }
  catch (err) {
      res.status(404).end();  //Mando errore!
  }
});

// TODO : the customer if FOR NOW is passed in the request, for the client side we need to get it from the cookie, so we probably need another route!
// NOTE : the route has an /employee in its path because we will need a /client route to take in account the login, the two route can't be the same, due to the fact that the eployee passes the client id as a parameter, while the client need to be recovered from the cookie

// POST /api/order/employee
app.post('/api/order/employee', [
  check('customerid').isNumeric().withMessage("customer id is incorrect"),
  check('state').isString().isLength({ min: 1 }).withMessage("state is incorrect"),
  check('delivery').isString().isLength({ min: 1 }).withMessage("delivery is incorrect"),
  check('total').isNumeric().withMessage("total is incorrect"),
  check('listitems').isArray().withMessage("listitems array is incorrect"),
  /* Check the parameters of the array */
  check('listitems.*.productid').isNumeric().withMessage("listitems : productid field is incorrect"),
  check('listitems.*.quantity').isNumeric().withMessage("listitems : quantity field is incorrect"),
  check('listitems.*.price').isNumeric().withMessage("listitems : price field is incorrect")
  ],
  async (req, res) => {

  //Check the result of the validation
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() }); //Converte in array gli errori
  }

    
  //Devo aspettare che la promise sia risolta! Metto await
  try {
      
      //1) We need to add the order to the clientorder tabel first
      const orderINST = { customerid: req.body.customerid, state: req.body.state, delivery: req.body.delivery, total: req.body.total};

      //2) post on DB and get the new Order ID back
      const order_id = await employeeDAO.createClientOrder(orderINST);

      //3) now I have the Order ID; I need now to store the orderitems

      //3.1) Get items
      const itemArray = req.body.listitems;
      
      //Check the length
      let i = 0;
      if (itemArray.length > 0){
          //Post them
          for (i = 0; i < itemArray.length; i++){
              const el = itemArray[i];

              const itemINST = {orderid : order_id, productid : el.productid, quantity : el.quantity, price : el.price}; 

              console.log(`item instance : ${itemINST}`);

              //POST IT
              const id_item = await employeeDAO.createOrderItem(itemINST);

          }
      }
      
      
      res.status(200).json({ orderid : order_id });  //Manda indietro un json (meglio di send e basta, e' piu' sucuro che vada)
  }
  catch (err) {
      res.status(500).end();  //Mando errore!
  }
});


//SERVER SIDE FOR THE STORIES NUMBER 4-5-9
//STORY NUMBER 4

//api for handing out the order number <id>.
// POST /api/orders/:id
app.post('/api/orders/:id/handOut', [
  check('id').isInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()});
    }
    try {
      const id = req.params.id;
      let result = await employeeDAO.handOutOrder(id);
      return res.status(200).json(result);
    }
    catch(err) {
      return res.status(500).json({error: 'DB error while handing out order'});
    }

});


// STORY NUMBER 5
app.get('/api/customers/all', async (req, res) => {

  try {
    const productsList = await employeeDAO.listCustomersAll();
    res.status(200).json(productsList);
  }
  catch (err) {
    res.status(404).end();
  }
});

app.post('/api/customers/wallet/:id/:value', [
  check('id').isInt(),
  check('value').isInt()],
  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()});
    }
    try {
      const id = req.params.id;
      const value = req.params.value;
      
      let result = await employeeDAO.updateCustomerWallet(id, value);
      return res.status(200).json(result);
    }
    catch(err) {
      console.log("44");
      return res.status(500).json({error: 'DB error when updating wallet'});
    }

})

//STORY NUMBER 9
//getting the list of products selled by a specific farmer
// GET /api/farmer/:id
app.get('/api/farmer/:id/products', (req, res) => {
  farmerDAO.getFarmerProducts(req.params.id)
  .then(products => {
    res.json(products);       
  })
  .catch(() => res.status(500).end());
});

//setting the expected amount of availability for a specific product
//it's an insert inside the warehouse table
//POST /api/warehouse
app.post('/api/warehouse', [
  //validation on product (which is the product id) and quantity. Both have to be integers
  check('product').isInt(),
  check('quantity').isInt() 
], async (req, res) => {
    const errors = validationResult(req); //looking for errors thrown by the validation
    if(!errors.isEmpty())
        return res.status(422).json({errors: errors.array()}); //unprocessable entity in case of errors
  
    const product = req.body;
    try{
      let result = await farmerDAO.addProductExpectedAmount(product);
      return res.status(200).json(result);
    }
    catch(err){
      console.log(err);
      return res.status(500).json({error: 'DB error during the add/update of a product availability'});
    }
});


/* END */




app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
}
)
