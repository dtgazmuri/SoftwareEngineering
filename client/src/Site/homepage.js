import {Container, Row, Col} from "react-bootstrap"
import {React} from 'react';
import { Link } from "react-router-dom";
import { login,signin } from "./icons";

function MyBody() 
    {

return (
    <Container fluid className="align-items-center">
        <Container id="title" className="align-items-center">
        <Row sm={5} className="title justify-content-center" >
        SolidarityPurchaseGroup
        </Row>
        <Row sm={5} className="justify-content-center">
        
        </Row>
        </Container>   
        <Row key ="main" id="main-row" className="h-100 v-70 justify-content-center">
            <Col id="signup-col" className = "v-100 d-sm-block">
                <Link to="/loginpage">
                    {/*<Button variant="outline-success">Log in</Button>*/}
                    <Container fluid className = "LoginButton shadow border border-dark rounded nolink">
                    {login}
                    <h3>Login</h3>
                    </Container> 
                </Link>                
            </Col>
            <Col id="signin-col" className= "v-100 d-sm-block">
                <Link to="/sign-in">
                    {/*<Button variant="outline-success">Log in</Button>*/}
                    <Container fluid className = "LoginButton border border-dark rounded nolink justify-content-center">
                    {signin}
                    <h3>SignIn</h3>
                    </Container> 
                </Link> 
            </Col>
        </Row>

    </Container>
        
)
}
export default MyBody;                    
