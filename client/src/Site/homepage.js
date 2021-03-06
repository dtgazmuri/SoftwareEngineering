import { Container, Row, Col } from "react-bootstrap"
import { React } from 'react';
import { Link } from "react-router-dom";
import { login, signin, productlist } from "./icons";

import "../App.css";



function MyBody() {

    return (
        <>
            <Container id="title" className="align-items-center">

                <Row>
                    <Container fluid className="align-items-center border border-5 border-dark border-left-0 border-right-0">
                        <br />
                        <br />
                        <Container className="border-white square border border-5 container-sm align-items-center" style={{ "backgroundColor": "rgba(0, 0, 0, 0.5)" }}>
                            <p style={{ "textAlign": "center", "color": "white", "fontSize": 30 }} className="align-middle">
                                <br />
                                <b>Solidarity Purchasing Group</b>
                                <br />
                            </p>
                            <br />
                        </Container>
                        <br />
                        <br />
                    </Container>
                </Row>

                &nbsp;

                

                <Row key="main" sm={10} id="main-row" className="h-100 v-70 justify-content-center">
                    <Col id="login-col" className="v-100 d-sm-block">
                        {/*<Button variant="outline-success">Log in</Button>*/}
                        <Container fluid className="LoginButton shadow border border-dark rounded nolink align-items-center">
                            <Link to="/loginpage" className="nolink">
                                <Container className="align-items-center">
                                    {login}
                                    <h3>Login</h3>
                                </Container>

                            </Link>
                        </Container>
                        &nbsp;
                    </Col>
                    <Col id="signin-col" className="v-100 d-sm-block">
                        {/*<Button variant="outline-success">Log in</Button>*/}
                        <Container fluid className="LoginButton border border-dark rounded nolink align-items-center">
                            <Link to="/sign-up" className="nolink fixed fixed-center">
                                {signin}
                                <h3>Sign-Up</h3>
                            </Link>
                        </Container>
                        &nbsp;
                    </Col>

                    <Col id="seeproduct-col" className="v-100 d-sm-block">
                        {/*<Button variant="outline-success">Log in</Button>*/}
                        <Container fluid className="LoginButton border border-dark rounded nolink align-items-center">
                            <Link to="/unregistered-productlist" className="nolink fixed fixed-center">
                                {productlist}
                                <h3>See Products</h3>
                            </Link>
                        </Container>
                        &nbsp;
                    </Col>
                </Row>

            </Container>
        </>
    )
}
export default MyBody;
