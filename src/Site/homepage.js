import {Button, Container, Row, Col} from "react-bootstrap"
import {React} from 'react';
import { Link } from "react-router-dom";

function MyBody() 
    {

return (
    <Container fluid>
        <Row sm={5} className="justify-content-center">
            <h1>SPG</h1>
        </Row>
        <Row sm={5} className="justify-content-center">
        <h6>The best blabla</h6>
        </Row>
            
        <Row key ="main" id="main-row" className="vh-100 justify-content-center">
            <Col id="signup-col" className = "v-100 d-sm-block">
                <Link to="/loginpage"><Button variant="outline-success">Log in</Button></Link>                
            </Col>
            <Col id="signin-col" className= "v-100 d-sm-block">
            <Link to ="/sign-in"><Button variant="outline-primary">Sign in</Button></Link>
            </Col>
        </Row>

    </Container>
        
)
}
export default MyBody;                    
