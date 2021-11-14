import logo from "./logo.svg";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./App.css";
import MyBody from "./Site/homepage";
import { SignupForm } from "./Site/signup";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import MyNavbar from "./Site/navbar";
import { Container } from "react-bootstrap";
import LoginPage from "./Site/loginpage";
import { useEffect, useState } from "react";
import API from "./API.js"
import { LoginForm } from "./Site/login";
import { CustomerHome }  from "./Site/customer"
import Basket from "./Site/Basket";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const [user, setUser] = useState();
  const [isLogged, setLogged] = useState(false);
  const [message, setMessage] = useState({type:"", msg:""}) //for messages interface!
  
  
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

  const notifySuccess = () => toast.success('Success!', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});
const notifyError = () => toast.error('Error: something went wrong', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});

  
  
/*


*/

  return (
    <Router>
      <MyNavbar />
      <Container fluid className="below-nav vh-100">
        <Routes>
          <Route path="/" element={<Navigate replace to="/home" />} />

          {/* Generic Error Page */}
          <Route path="/error" element={<ErrorPage />} />

          {/*Route di Login*/}
          <Route path="/loginpage" element={<LoginPage />} />

          <Route path="/loginpage/:type" element={<LoginForm />} />
          {/*Route di Registrazione*/}
          <Route path="/sign-up" element={<SignupForm notifySuccess={notifySuccess} notifyError={notifyError}/>} />
          {/* BODY PER HOMEPAGE */}
          <Route exact path="/home" element={<MyBody />} />
          {/* Customer homepage route */}
          <Route exact path="/customer" element={<CustomerHome user={user}/>}/>
          <Route exact path="/customer/:id/basket" element={<Basket />} />
        </Routes>
      </Container>
      <ToastContainer 
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover/>
    </Router>
  );
}
function ErrorPage() {
  return (
    <Container fluid className="center vh-100 below-nav">
      <h1>Page not found</h1>
      <Link to="/">Go Back to Home</Link>
    </Container>
  );
}

export default App;
