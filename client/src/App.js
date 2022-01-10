//CSS FILES - Bootstrap - Custom - React
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";

//REACT COMPONENTS
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Alert, Container, Button, Spinner, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { ToastContainer } from "react-toastify";
//Our components
import MyBody from './Site/homepage'
import MyNavbar from './Site/navbar';
import LoginPage from './Site/loginpage'
import EmployeePage from './Site/Employee/shopemployeepage';
import ProductList from './Site/Employee/ProductListEmployee';
import { UnregisteredUserProductList } from './Site/Unregistered/undergisteredProductList';
import { CustomerList, OrderList } from './Site/Employee/employee';
import { CancelationOrderList } from './Site/Employee/cancelationorders';
import { ReportLostFood } from './Site/Employee/reportlostfood';
import { FarmerPage, ConfirmOrdersSection, FarmerProducts } from './Site/Farmer/FarmerPage';
import { SignupForm } from "./Site/signup";
import { CustomerHome } from "./Site/Customer/customer";
import { Basket } from "./Site/Customer/Basket";
import { Clock } from './Clock';
import { ManagerPage, ManagerPageFarmerOrders, ManagerReports } from './Site/Manager/ManagerPage';
import { notifyBalance, notifyQuantity, notifyError, notifySuccess } from './toastes'
//API
import API from "./API.js";

function App() {
  const [user, setUser] = useState();
  const [isLogged, setLogged] = useState(false);
  const [message, setMessage] = useState({ type: "", msg: "" }); //for messages interface!
  const [url, setURL] = useState("");
  const [time, setTime] = useState();
  const [notifOfTime, setNotifOfTime] = useState(false);
  const [isLoading, setLoading] = useState(false)

  //AUTH LOGIN LOGOUT
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await API.getAdmin().then((u) => {
          setUser(u);
          console.log(u);
          setURL(`/${u.role}`);
          setLogged(true);
          setMessage({
            type: "success",
            msg: `Welcome back, ${u.username}`,
          });
          setTimeout(() => {
            setMessage({ type: "", msg: "" });
          }, 3000);
        });
      } catch (err) {
        setLogged(false);
        console.log(err);
      }
    };
    setLoading(true)
    checkAuth();
    setLoading(false)
  }, []);

  useEffect(() => {
    const checkTime = async () => {
      const time = dayjs(getCurrentTime());
      if (
        time &&
        time.day() === 6 &&
        time.hour() === 9 &&
        time.minute() === 0 &&
        notifOfTime === false
      ) {
        console.log("should notify now");
        try {
          setNotifOfTime(true);
          await API.notifyOfTime();
        } catch (err) {
          console.log(err);
        }
      }
      if (
        time &&
        time.day() === 6 &&
        time.hour() === 9 &&
        time.minute() === 1
      ) {
        setNotifOfTime(false);
      }
    };
    checkTime();
  }, [time]);

  const doLogin = async (credentials) => {
    try {
      setLoading(true)
      const currentUser = await API.login(credentials);
      setUser(currentUser);
      setURL(`/${currentUser.role}`);
      setLogged(true);
      setLoading(false)
      setMessage({ type: "success", msg: `Welcome, ${currentUser.username} ` });
      setTimeout(() => {
        setMessage({ type: "", msg: "" });
      }, 3000);
    } catch (err) {
      setLoading(false)
      setMessage({ type: "danger", msg: `Login failed. ${err}` });
      setTimeout(() => {
        setMessage({ type: "", msg: "" });
      }, 3000);
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
    setLoading(true)
    await API.logout();
    //Inizializzo gli stati
    setLogged(false);
    setLoading(false)
    setURL("");
    setUser("");
    setMessage({ type: "success", msg: "Logout accomplished" });
    setTimeout(() => {
      setMessage({ type: "", msg: "" });
    }, 3000);
  };

  /**USE THIS FUNCTION TO GET THE CURRENT TIME OF THE APPLICATION */
  const getCurrentTime = () => {
    return time;
  };

  return (
    <Router>
      <MyNavbar logout={doLogout} isLogged={isLogged} />

      <Container fluid className="below-nav vh-100 backg" />

      <Container fluid className="below-nav">
        {isLoading ?
          <LoadingPage /> :
          <Container
            fluid
            className="d-flex justify-content-center align-items-center"
            style={{ paddingBottom: 8 }}
          >
            <b>
              <Clock
                time={time}
                setTime={setTime}
                
              />
            </b>
            &nbsp;&nbsp;&nbsp;&nbsp;
          </Container>
        }

        {message.msg !== "" ? (
          <Alert className="" variant={message.type}>
            {message.msg}
          </Alert>
        ) : (
          ""
        )}

        <Routes>
          <Route
            exact
            path="/"
            element={
              isLogged ? (
                <Navigate replace to={url} />
              ) : (
                <Navigate replace to="/home" />
              )
            }
          />

          {/* Generic Error Page */}
          <Route path="/error" element={<ErrorPage />} />
            
          {/* BODY PER HOMEPAGE */}
          <Route
            path="/home"
            element={!isLogged ? <MyBody /> : <Navigate replace to={url} />}
          />

          <Route
            path="/loginpage/"
            element={
              isLogged ? (
                <Navigate replace to={url} />
              ) : (
                <LoginPage login={doLogin} setMessage={setMessage} />
              )
            }
          />

          {/* UNREGISTERED USER ROUTES */}
          <Route
            path="/unregistered-productlist/"
            element={
              <UnregisteredUserProductList time={time}/>
            }
          />
          /

          {/**SHOP EMPLOYEE ROUTES */}
          <Route
            path="/shopemployee/selection/"
            element={
              isLogged ? (
                <ProductList
                  setMessage={setMessage}
                  time={time}
                />
              ) : (
                <Navigate replace to="/home" />
              )
            }
          />

          <Route
            path="/shopemployee/products/"
            element={
              isLogged ? (
                <ProductList
                  setMessage={setMessage}
                  time={time}
                />
              ) : (
                <Navigate replace to="/home" />
              )
            }
          />

          <Route
            path="/shopemployee/handout/"
            element={
              isLogged ? (
                <OrderList getCurrentTime={getCurrentTime} />
              ) : (
                <Navigate replace to="/home" />
              )
            }
          />

          <Route
            path="/shopemployee/topupwallet/"
            element={
              isLogged ? <CustomerList /> : <Navigate replace to="/home" />
            }
          />

          <Route
            path="/shopemployee/cancelationpending/"
            element={
              isLogged ? (
                <CancelationOrderList />
              ) : (
                <Navigate replace to="/home" />
              )
            }
          />

          <Route
            path="/shopemployee/reportlostfood/"
            element={
              isLogged ? (
                <ReportLostFood getCurrentTime={getCurrentTime} />
              ) : (
                <Navigate replace to="/home" />
              )
            }
          />

          {/**Route for the main page of the shop employee */}
          <Route
            exact
            path="/shopemployee/"
            element={
              isLogged ? (
                <EmployeePage addClient={addClient} />
              ) : (
                <Navigate replace to="/" />
              )
            }
          />

          {/**FARMER ROUTES */}
          {/**Route for the main page of the farmer */}
          <Route exact path="/farmer" element={
            isLogged ? <FarmerPage getCurrentTime={getCurrentTime} user={user} />
              : <Navigate replace to="/" />
          }
          />
          {/*the old page is here
          <Route exact path="/farmer2" element={<Farmer2 getCurrentTime={getCurrentTime} user={user} />} />*/}

          <Route exact path="/farmer/yourproducts"
            element={
              isLogged ? <FarmerProducts user={user} getCurrentTime={getCurrentTime} />
                : <Navigate replace to="/" />
            }
          />

          <Route exact path="/farmer/orders"
            element={
              isLogged ? <ConfirmOrdersSection user={user} getCurrentTime={getCurrentTime} />
                : <Navigate replace to="/" />
            }
          />


          {/**MANAGER ROUTER */}
          {/**Route for the main page of the manager */}
          <Route
            exact
            path="/manager"
            element={
              isLogged ? (
                <ManagerPage user={user} getCurrentTime={getCurrentTime} />
              ) : (
                <Navigate replace to="/" />
              )
            }
          />
          <Route
            exact
            path="/manager/farmerorders"
            element={
              isLogged ? (
                <ManagerPageFarmerOrders
                  user={user}
                  getCurrentTime={getCurrentTime}
                />
              ) : (
                <Navigate replace to="/" />
              )
            }
          />
          <Route
            exact
            path="/manager/reports"
            element={
              isLogged ? (
                <ManagerReports user={user} getCurrentTime={getCurrentTime} />
              ) : (
                <Navigate replace to="/" />
              )
            }
          />

          <Route
            path="/sign-up"
            element={
              <SignupForm
                notifySuccess={notifySuccess}
                notifyError={notifyError}
              />
            }
          />
          {/* BODY PER HOMEPAGE */}
          <Route exact path="/home" element={<MyBody />} />
          {/* Customer homepage route */}
          <Route
            exact
            path="/customer"
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
          <Route
            exact
            path="/customer/:id/basket"
            element={
              <Basket
                user={user}
                setMessage={setMessage}
                notifyBalance={notifyBalance}
                notifyQuantity={notifyQuantity}
                getCurrentTime={getCurrentTime}
              />
            }
          />
          <Route element={<Navigate replace to="/error" />} />
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
function LoadingPage() {
  return (<Container className="vh-100 d-flex fixed-center justify-content-center align-items-center">
    <Col>
    </Col>
    <Col className="align-items-center">
      <Row> <h1>Hold on</h1> </Row>
      <Row> <Spinner animation="border" variant="primary" /></Row>
      <Row><h5>We're landing on the right page - - -</h5></Row>
    </Col>
    <Col>
    </Col>
  </Container>)
}
export default App;
