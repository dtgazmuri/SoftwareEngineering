import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import {Routes, Route, Link, Navigate} from 'react-router-dom'
<<<<<<< HEAD
import MyNavbar from './Site/navbar';
import { Alert, Container } from 'react-bootstrap';
import SigninPage from './Site/signinpage';
<<<<<<< HEAD
import { LoginPage } from './Site/login';
=======
import LoginPage from './Site/loginpage'
>>>>>>> story-1-2-3
=======
import { Container } from 'react-bootstrap';
>>>>>>> 5cbd752809e454ab3c589a2bf1486cebde84076d
import { useState, useEffect } from 'react';

//MY PAGES
import MyBody from "./Site/homepage";
import MyNavbar from "./Site/navbar";
import LoginPage from "./Site/loginpage";
import { LoginForm } from "./Site/login";
import Employee from "./Site/employee";
import Farmer from "./Site/farmer";
import SigninPage from './Site/signinpage';
import API from "./API.js"
import MyPage from './Site/shopemployeepage';
import ProductList from './Site/ProductList';


function App() {
  const [user, setUser] = useState("");
  const [isLogged, setLogged] = useState(false);
  const [message, setMessage] = useState({type:"", msg:""}) //for messages interface!
  
  
  //AUTH LOGIN LOGOUT 

  useEffect(() => {
    const checkAuth = async () => {
      try {        
        const user = await API.getAdmin();
        setUser(user);
        setLogged(true);
<<<<<<< HEAD
=======
        setMessage({type:"success", msg:`Welcome back, ${user.username}`})
>>>>>>> story-1-2-3
      } catch (err) {
        setLogged(false)
        console.log(err.error);
      }
    };
    checkAuth();


  }, []);

  const doLogin = async (credentials) => {
    try {   
      const user = await API.login(credentials);
      setUser(user);
      setLogged(true);
      console.log(user);
<<<<<<< HEAD
<<<<<<< HEAD
=======
      setMessage({type:"success", msg:`Welcome, ${user.username} `})
>>>>>>> story-1-2-3
=======
      setMessage({type:"success", msg:`Welcome, ${user.name} `})
>>>>>>> 5cbd752809e454ab3c589a2bf1486cebde84076d
    }
    catch (err) {
      setMessage({type:"danger", msg:`Login failed. ${err}`})
      throw err;
    }
  }
  
  const addClient = async (cust) => {
    try {
      const resp = await API.postNewCustomer(cust);

      console.log(`response : ${resp}`);

      return resp;
    }
    catch(err) {
      setMessage({type:"error", msg:`Error in adding customer! Error ${err}`});

      return {error : err };
    }
  }

  const doLogout = async () => {
    await API.logout()
    //Inizializzo gli stati
    setLogged(false);
    setUser("");
    setMessage({type:"success", msg:"Logout effettuato correttamente"})
  }
  
  
/*


*/

  return (
  <Router>
      <MyNavbar logout={doLogout} isLogged = {isLogged}/>
      
      <Container fluid className="below-nav vh-100 backg">
      {message.msg!==""?<Alert className = "" variant = {message.type}>{message.msg}</Alert>:""}
          
      <Routes>
        <Route path="/" element={<Navigate replace to="/home" />} />          
              
          {/* Generic Error Page */}
          <Route path='/error' element = {
            <ErrorPage/>
          }/>
          
            {/*Route di Login*/}
          <Route path="/sign-in" element = {<SigninPage/>}/> 
          
<<<<<<< HEAD
          <Route path ="/loginpage" element = {isLogged?<Navigate replace to="/home"/> : <LoginPage login = {doLogin}/>} />
=======
          <Route path ="/loginpage/" element = {isLogged?<Navigate replace to="/home"/> : <LoginPage login = {doLogin} setMessage={setMessage}/>} />
>>>>>>> story-1-2-3
            {/*Route di Registrazione*/}
          
          <Route path = "/products/" element = {isLogged?<ProductList setMessage={setMessage}/>:<Navigate replace to="/home"/> }/>

          {/* BODY PER HOMEPAGE */}
          <Route exact path="/home" element = {!isLogged? <MyBody/>
          :
          <MyPage user = {user} addClient = {addClient} setMessage={setMessage}/>}
          />
          {/**Route for the main page of the shop employee */}
          <Route exact path="/employee" element={<Employee />} />
          {/**Route for the main page of the shop employee */}
          <Route exact path="/farmer" element={<Farmer />} />
          
          
        
      </Routes>
      </Container>
    </Router>
    
  );
}
function ErrorPage() {
  return (
    <Container fluid className='center vh-100 below-nav'>
      <h1>Page not found</h1>
      <Link to='/'>Go Back to Home</Link>
    </Container>
  )
}

export default App;
