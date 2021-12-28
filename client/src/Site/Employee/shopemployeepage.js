import { Container, Col, Row } from 'react-bootstrap';
import { SignupForm } from "./newclientform.js"
import { signin, wallet, deliverybig, shopemployeebig, lostfood } from '../icons';
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
            <Container test-id = "create-button" fluid className="LoginButton border border-dark rounded nolink text-decoration" align="center" onClick={handleShow}>
              {signin}
              <h3>Create new Client</h3>
            </Container>

          </Col>
          <Col id="products-col">
            <Link to="/shopemployee/products">
              <Container test-id="show-button" fluid className="LoginButton border border-dark rounded nolink" align="center">
                {shopemployeebig}
                <h3>Show Products</h3>
              </Container>
            </Link>
          </Col>
          </Row>
          <br></br>
          <Row id="second">
          <Col id="topup-col">
            <Link to = "/shopemployee/topupwallet/" >
              <Container test-id="topup-button" fluid className="LoginButton border border-dark rounded nolink" align="center">
                {wallet}
                <h3>Top Up Wallet</h3>
              </Container>
              </Link>
          </Col>
          <Col id="handout-col">
            <Link to ="/shopemployee/handout">
              <Container test-id="handout-button" fluid className="LoginButton border border-dark rounded nolink" align="center">
                {deliverybig}
                <h3>Handout Order</h3>
              </Container>
              </Link>
          </Col>
          </Row>
          <br></br>
          <Row id="third">
          <Col id="cancelation-pending-col">
            <Link to ="/shopemployee/cancelationpending">
              <Container test-id="pending-button" fluid className="LoginButton border border-dark rounded nolink" align="center">
                {deliverybig}
                <h4>Orders Pending Cancelation</h4>
              </Container>
              </Link>
          </Col>
          <Col id="cancelation-pending-col">
            <Link to ="/shopemployee/reportlostfood">
              <Container test-id="pending-button" fluid className="LoginButton border border-dark rounded nolink" align="center">
                {lostfood}
                <h4>Report Lost Food</h4>
              </Container>
              </Link>
          </Col>
          </Row>
          <br></br>
          
          <SignupForm show={show} handleShow={handleShow} handleClose={handleClose} addClient={props.addClient} />
        </Container>
    </>
  )
}




export default MyPage;
