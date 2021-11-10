import logo from "./logo.svg";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { Container } from "react-bootstrap";

//MY PAGES
import MyBody from "./Site/homepage";
import MyNavbar from "./Site/navbar";
import LoginPage from "./Site/loginpage";
import { LoginForm } from "./Site/login";
import Employee from "./Site/employee";
import Farmer from "./Site/farmer";

function App() {
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
          <Route path="/sign-in" /*element = {</>}*/ />
          {/* BODY PER HOMEPAGE */}
          <Route exact path="/home" element={<MyBody />} />
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
    <Container fluid className="center vh-100 below-nav">
      <h1>Page not found</h1>
      <Link to="/">Go Back to Home</Link>
    </Container>
  );
}

export default App;
