import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import {shopemployee,customer,farmer,delivery, warehouse, manager } from "./icons.js"
function SigninPage() {
    return(
        <Container className="below-nav justify-content-center">
            <Row>
            <h1>Please select the type of account you want to create:</h1>
            </Row>
            <Row className ="my-3" align="center">
                <Col className="py-3" >
                    {/** TO-DO: UPDATE ROUTE WITH SIGN IN**/}
                    <Link to="/loginpage/customer/" className="nolink">
                        {customer}
                        <h2>Customer</h2>
                    </Link>
                </Col>
                <Col className="py-3">
                    <Link to="/loginpage/shopemployee/" className="nolink">
                        {shopemployee}
                        <h2>Shop Employee</h2>
                    </Link>
                </Col>
                <Col className="py-3">
                    <Link to="/loginpage/farmer/" className="nolink">
                        {farmer}
                        <h2>Farmer</h2>
                    </Link>
                </Col>
                </Row>
                <Row  className="my-3" align="center">
                <Col className="py-3">
                <Link to="/loginpage/delivery/" className="nolink">
                {delivery}
                <h2>Delivery</h2>
                </Link>
                </Col>
                <Col className="py-3">
                <Link to="/loginpage/warehouse/" className="nolink">
                {warehouse}
                <h2>Warehouse</h2>
                </Link>
                </Col>
                <Col className="py-3">
                <Link to="/loginpage/manager/" className="nolink">
                {manager}
                <h2>Manager</h2>
                </Link>
                </Col>
            </Row>



        </Container>
    )
}
export default SigninPage;