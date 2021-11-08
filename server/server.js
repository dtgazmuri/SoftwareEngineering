

/*TO DO: capire se usare un unico db con campo tipodiuser o diverse tabelle*/
const userDao = ""; 


const {check, validationResult} = require('express-validator'); // validation middleware
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
  if(req.isAuthenticated()) {
    res.status(200).json(req.user);}
  else
    res.status(401).json({error: 'Unauthenticated user!'});;
});





 
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
}
)
