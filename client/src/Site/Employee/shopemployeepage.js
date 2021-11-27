import { Container, Col, Row } from 'react-bootstrap';
import { SignupForm } from "./newclientform.js"
import { signin, wallet, deliverybig, shopemployeebig } from '../icons';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function MyPage(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>


      <Container fluid className="below-nav vh-100 align-items-center">
        <Row id="first">
          <Col id="signin-col" >
            <Container fluid className="LoginButton border border-dark rounded nolink text-decoration" align="center" onClick={handleShow}>
              {signin}
              <h3>Create new Client</h3>
            </Container>

          </Col>
          <Col id="products-col">
            <Link to="/shopemployee/products">
              <Container fluid className="LoginButton border border-dark rounded nolink" align="center">
                {shopemployeebig}
                <h3>Show products</h3>
              </Container>
            </Link>
          </Col>
          </Row>

          <Row id="second">
          <Col id="topup-col">
            <Link to = "/shopemployee/topupwallet/" >
              <Container fluid className="LoginButton border border-dark rounded nolink" align="center">
                {wallet}
                <h3>Top Up Wallet</h3>
              </Container>
              </Link>
          </Col>
          <Col id="handout-col">
            <Link to ="/shopemployee/handout">
              <Container fluid className="LoginButton border border-dark rounded nolink" align="center">
                {deliverybig}
                <h3>Handout Order</h3>
              </Container>
              </Link>
          </Col>
          </Row>
          <Row id="third">
          <Col id="handout-col">
            <Link to ="/shopemployee/cancelationpending">
              <Container fluid className="LoginButton border border-dark rounded nolink" align="center">
                {deliverybig}
                <h4>Orders pending cancelation</h4>
              </Container>
              </Link>
          </Col>
          </Row>
          
          <SignupForm show={show} handleShow={handleShow} handleClose={handleClose} addClient={props.addClient} />
        </Container>
    </>
  )
}




export default MyPage;
