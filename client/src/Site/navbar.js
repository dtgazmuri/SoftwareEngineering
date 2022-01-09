import { Link, useLocation } from "react-router-dom";
import { Col, Navbar, Button, Image } from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons";
import { useEffect, useState } from "react";
import icon from "./images/icon.png";
function MyNavbar(props) {
  const [loc, setLoc] = useState(true);
  let location = useLocation();

  useEffect(
    () => {
      const handleLocation = () => {
        const l = location.pathname.split("/")[1];
        if (
          l === "home" ||
          (l === "shopemployee" &&
            location.pathname.split("/")[2] === undefined) ||
          l === "customer" ||
          l === "farmer" ||
          (l === "manager" && location.pathname.split("/")[2] === undefined)
        )
          setLoc(false);
        else setLoc(true);
      };
      handleLocation();
    },
    [location.pathname] //eslint-disable-line
  );

  return (
    <Navbar
      bg="dark"
      variant="dark"
      fixed="top"
      className="d-flex justify-content-between"
    >
      <Col className="d-flex">
        {/* Bottone Toggler */}
        {loc ? (
          <Link to="../">
            {" "}
            <ArrowLeft test-id="back" variant="outline-light" />{" "}
          </Link>
        ) : props.isLogged ? (
          <TelegramBotButton></TelegramBotButton>
        ) : (
          ""
        )}
        {/* Logo + Nome */}
      </Col>
      <Col lg={8} xs={4} className="d-flex justify-content-center">
        <Navbar.Brand fixed="center">
          <Link to="/" className="nolink" variant="outline-light">
            <Image width="35" height="35" src={icon} alt="we" />
            <span style={{ color: "white" }}> SPG </span>
          </Link>
        </Navbar.Brand>
      </Col>
      <Col className="d-flex justify-content-end">
        {props.isLogged ? <LogoutButton logout={props.logout} /> : ""}
      </Col>
    </Navbar>
  );
}

export function LogoutButton(props) {
  return (
    <Link to="/">
      <Button variant="outline-light" test-id="logout" onClick={props.logout}>
        Logout
      </Button>
    </Link>
  );
}

export function TelegramBotButton() {
  return (
    <a href="https://t.me/SolidarityPurchasingGroupBot" target="_blank">
      <Button variant="outline-light" test-id="bot">
        Telegram
      </Button>
    </a>
  );
}

export default MyNavbar;
