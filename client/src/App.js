import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './App.css';
import MyBody from './Site/homepage'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import MyNavbar from './Site/navbar';
import { Alert, Container, Button } from 'react-bootstrap';
import SigninPage from './Site/signinpage';
import LoginPage from './Site/loginpage'
import { useState, useEffect } from 'react';
import API from "./API.js"
import EmployeePage from './Site/Employee/shopemployeepage';
import ProductList from './Site/Employee/ProductList';
import { CustomerList, OrderList } from './Site/Employee/employee';
import Farmer from './Site/farmer';
import { SignupForm } from "./Site/signup";
import { CustomerHome } from "./Site/customer";
import Basket from "./Site/Basket";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from 'dayjs';
import { Clock, ModalDate } from './Clock';
import { Calendar } from 'react-bootstrap-icons';

function App() {
  const [user, setUser] = useState();
  const [isLogged, setLogged] = useState(false);
  const [message, setMessage] = useState({ type: "", msg: "" }); //for messages interface!
  const [url, setURL] = useState("");
  const [time, setTime] = useState();
  const [faketime, setFakeTime] = useState();
  const [showModal, setShowModal] = useState(false);
  const [dirty, setDirty] = useState(false) //to see if the time is real-time or not 

  //you need to add time={dirty ? time : faketime}

  //AUTH LOGIN LOGOUT
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await API.getAdmin().then((u) => {
          setUser(u);
          console.log(u);
          setURL(`/${u.role}`);
          console.log(url);
          setLogged(true);
          console.log("logged in user");
          setMessage({
            type: "success",
            msg: `Welcome back, ${u.username}`,
          });
        });
      } catch (err) {
        setLogged(false);
        console.log(err);
      }
    };
    checkAuth();
  }, []);

  const doLogin = async (credentials) => {
    try {
      const user = await API.login(credentials);
      setUser(user);
      setURL(`/${user.role}`);
      console.log(url);
      setLogged(true);
      setMessage({ type: "success", msg: `Welcome, ${user.username} ` });
    } catch (err) {
      setMessage({ type: "danger", msg: `Login failed. ${err}` });
      throw err;
    }
  };

  const addClient = async (cust) => {
    try {
      const resp = await API.postNewCustomer(cust);

      console.log(`response : ${resp}`);

      return resp;
    } catch (err) {
      setMessage({
        type: "error",
        msg: `Error in adding customer! Error ${err}`,
      });

      return { error: err };
    }
  };

  const doLogout = async () => {
    await API.logout();
    //Inizializzo gli stati
    setLogged(false);
    setURL("");
    setUser("");
    setMessage({ type: "success", msg: "Logout accomplished" });
  };

  const notifySuccess = () =>
    toast.success("Success!", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  const notifyError = () =>
    toast.error("Error: something went wrong", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  const notifyBalance = () =>
    toast.warn("Balance insufficient!", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  const notifyQuantity = () =>
    toast.warn("Maximum quantity reached!", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  const handleOpenModal = () => {
    setShowModal(true)
  }
  const handleCloseModal = () => {
    setShowModal(false)
  }

  /**USE THIS FUNCTION TO GET THE CURRENT TIME OF THE APPLICATION */
  const getCurrentTime = () => {
    if(!dirty)
      return time;
    else 
      return faketime;
  }

  return (
    <Router>
      <MyNavbar logout={doLogout} isLogged={isLogged} />

      <Container fluid className="below-nav vh-100 backg" />

      <Container fluid className="below-nav" >
        <Clock time={time} faketime={faketime} setTime={setTime} setFakeTime={setFakeTime} setDirty={setDirty} dirty={dirty} />
        <Button onClick={handleOpenModal}><Calendar/> S</Button>
        <ModalDate show={showModal} 
          handleClose={handleCloseModal} 
          setFakeTime={setFakeTime} 
          setDirty={setDirty} 
          dirty={dirty} 
          setTime={setTime} />
        {message.msg !== "" ? (
          <Alert className="" variant={message.type}>
            {message.msg}
          </Alert>
        ) : (
          ""
        )}

<<<<<<< HEAD
      <Routes>
        <Route exact path="/" element={isLogged?
        <Navigate replace to={url} />
        :
        <Navigate replace to="/home" />
      }
        />
=======
        <Routes>
          <Route exact path="/" element={isLogged ? <Navigate replace to={url} /> : <Navigate replace to="/home" />
          }
          />
>>>>>>> b32e3c96750e735bc4aeee6491e858899e427553

          {/* Generic Error Page */}
          <Route path="/error" 
          element={<ErrorPage />} />

          {/* BODY PER HOMEPAGE */}
          <Route path="/home" element={!isLogged ? <MyBody /> : <Navigate replace to={url} />}
          />

          {/*Route di Login*/}
          <Route path="/sign-in" element={<SigninPage />} />

          <Route path="/loginpage/" element={isLogged ?
            <Navigate replace to={url} />
            :
            <LoginPage login={doLogin} setMessage={setMessage} />
          }
          />

          <Route path="/shopemployee/products/"
            element={isLogged ? <ProductList setMessage={setMessage} time={dirty ? time : faketime} />
               : 
                <Navigate replace to="/home" />
              
            }
          />

          <Route
            path="/shopemployee/handout/"
            element={isLogged ? <OrderList /> : <Navigate replace to="/home" />}
          />

          <Route
            path="/shopemployee/topupwallet/"
            element={
              isLogged ? <CustomerList  /> : <Navigate replace to="/home" />
            }
          />

          {/**Route for the main page of the shop employee */}
          <Route exact path="/shopemployee/"
            element={
              isLogged ? <EmployeePage 
                addClient={addClient} />
               : <Navigate replace to="/" />
            }
          />
          {/**Route for the main page of the shop employee */}
          <Route exact path="/farmer/" element={<Farmer />} />

          <Route path="/sign-up" element={
              <SignupForm
                notifySuccess={notifySuccess}
                notifyError={notifyError}
              />
            }
          />
          {/* BODY PER HOMEPAGE */}
          <Route exact path="/home" element={<MyBody />} />
          {/* Customer homepage route */}
          <Route exact path="/customer"
            element={
              isLogged ? (
                <CustomerHome
                  user={user}
                  notifyBalance={notifyBalance}
                  notifyQuantity={notifyQuantity}
                />
              ) : (
                <Navigate replace to="/home" />
              )
            }
          />
          <Route exact path="/customer/:id/basket"
            element={<Basket 
              notifyBalance={notifyBalance} 
              notifyQuantity={notifyQuantity}/>
            }
          />
          {/**if the url does not match anyone of the above, navitage to error page 
          <Route 
            element={
                 <Navigate replace to="/error" />
            }
          />*/}
        </Routes>
      </Container>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
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
