import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './App.css';
import MyBody from './Site/homepage'
import { BrowserRouter as Router } from 'react-router-dom';
import {Routes, Route, Link, Navigate} from 'react-router-dom'
import MyNavbar from './Site/navbar';
import { Container } from 'react-bootstrap';
import SigninPage from './Site/signinpage';
import LoginPage from './Site/loginpage'
import { useState, useEffect } from 'react';
import API from "./API.js"
import MyPage from './Site/shopemployeepage';
import ProductList from './Site/ProductList';

function App() {
  const [user, setUser] = useState();
  const [isLogged, setLogged] = useState(false);
  const [message, setMessage] = useState({type:"", msg:""}) //for messages interface!
  const [products, setProducts] = useState([]);
  
  //AUTH LOGIN LOGOUT 

  useEffect(() => {
    const checkAuth = async () => {
      try {        
        const user = await API.getAdmin();
        setUser(user);
        setLogged(true);
        setMessage({type:"success", msg:`Bentornato, ${user.name}`})
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
      setMessage({type:"success", msg:`Welcome, ${user.name} `})
    }
    catch (err) {
      setMessage({type:"danger", msg:`Login failed. ${err}`})
      throw err;
    }
  }
  
  const addClient = async (cust) => {
    try{
      await API.postNewCustomer(cust);
    }
    catch(err) {
      setMessage({type:"error", msg:`Error in adding customer! Error ${err}`})  
    }
  }

  const doLogout = async () => {
    await API.logout()
    //Inizializzo gli stati
    setLogged(false);
    setUser("");
    setMessage({type:"success", msg:"Logout effettuato correttamente"})
  }
  
  //PRODUCTS FETCH
  useEffect(() => {
    const getProducts = async () => {
      try {
        const products = await API.fetchAllProducts();
        console.log(products);
        setProducts(products);
      } catch (err) {
        setLogged(false)
        console.log(err.error);
      }
    };
    getProducts();
  }, []);
/*


*/

  return (
  <Router>
      <MyNavbar logout={doLogout} isLogged = {isLogged}/>
      <Container fluid className="below-nav vh-100 backg">
      <Routes>
        <Route path="/" element={<Navigate replace to="/home" />} />          
              
          {/* Generic Error Page */}
          <Route path='/error' element = {
            <ErrorPage/>
          }/>
          
            {/*Route di Login*/}
          <Route path="/sign-in" element = {<SigninPage/>}/> 
          
          <Route path ="/loginpage/" element = {isLogged?<Navigate replace to="/home"/> : <LoginPage login = {doLogin}/>} />
            {/*Route di Registrazione*/}
          
          <Route path = "/products/" element = {<ProductList products = {products} />}/>

          {/* BODY PER HOMEPAGE */}
          <Route exact path="/home" element = {!isLogged? <MyBody/>
          :
          <MyPage user = {user} addClient = {addClient} />}
          />
          
          
        
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
