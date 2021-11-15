import { Container, Col } from 'react-bootstrap';
import { SignupForm } from "./newclientform.js"
import { signin, shopemployee } from './icons';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function MyPage(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>


      <Container fluid className="below-nav vh-100">
        <Container fluid>
          <Col id="signin-col" >
            <Container fluid className="LoginButton border border-dark rounded nolink" align="center" onClick={handleShow}>
              {signin}
              <h3>Create new Client</h3>
            </Container>

          </Col>
          <Col id="products-col">
            <Link to="/products">
              <Container fluid className="LoginButton border border-dark rounded nolink" align="center">
                {shopemployee}
                <h3>Show products</h3>
              </Container>
            </Link>
          </Col>
          <SignupForm show={show} handleShow={handleShow} handleClose={handleClose} addClient={props.addClient} />
        </Container>
      </Container>
    </>
  )
}




export default MyPage;
