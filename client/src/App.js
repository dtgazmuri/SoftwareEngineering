import logo from "./logo.svg";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./App.css";
import MyBody from "./Site/homepage";
import {SignupForm} from "./Site/signup";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import MyNavbar from "./Site/navbar";
import { Container } from "react-bootstrap";
import LoginPage from "./Site/loginpage";
import { LoginForm } from "./Site/login";
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
          <Route path="/sign-up" element = {<SignupForm/>} />
          {/* BODY PER HOMEPAGE */}
          <Route exact path="/home" element={<MyBody />} />
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
