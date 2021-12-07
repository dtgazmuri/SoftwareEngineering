import { Link, useLocation } from 'react-router-dom';
import { Col, Navbar, Button } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';
import {useEffect, useState} from 'react';


function MyNavbar(props) {
  const [loc, setLoc] = useState(true);
  let location = useLocation();

  useEffect(() => {
    const handleLocation = () => {
        const l = location.pathname.split("/")[1];
        if(l === "home" || (l==="shopemployee" && location.pathname.split("/")[2]===undefined) || l==="customer" || l==="farmer")
          setLoc(false);
        else
          setLoc(true);
    }
    handleLocation()
},
[location.pathname] //eslint-disable-line
)

  return (

    <Navbar bg='dark' variant='dark' fixed='top' className="d-flex justify-content-between" >
        <Col className="d-flex">

          {/* Bottone Toggler */}
          {loc && 
          <Link to="../"> <ArrowLeft variant="outline-light" /> </Link>}
          {/* Logo + Nome */}
        </Col>
        <Col lg= {8} xs={4} className="d-flex justify-content-center">
          <Navbar.Brand fixed="center">
            <Link to="/" className="nolink" variant="outline-light">
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-shop" viewBox="0 0 16 16">
                  <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.371 2.371 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976l2.61-3.045zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0zM1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h6V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5zM4 15h3v-5H4v5zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3zm3 0h-2v3h2v-3z" />
                </svg>
              </span>
              <span> SPG </span>
            </Link>
          </Navbar.Brand>
        </Col>
        <Col className="d-flex justify-content-end">
          {props.isLogged ?
            <LogoutButton logout={props.logout} />
            : ""
          }
        </Col>
      
    </Navbar>

  )
}

export function LogoutButton(props) {
  return (
      <Link to="/">
        <Button variant="outline-light" onClick={props.logout}>Logout</Button>
      </Link>
  )
}

export default MyNavbar;