import { Form, Button, Alert, Container, Col, Card, Row, Nav} from 'react-bootstrap';
import { useState } from 'react';



function matchExact(r, str) {
   var match = str.match(r);
   return match && str === match[0];
}


function LoginPage(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [validated, setValidated] = useState(false);


  const handleSubmit = (event) => {
    event.preventDefault();
    setValidated(false);
    setErrorMessage('');
    const credentials = { username, password };
    let valid = true;
    let regex = '[a-zA-Z0-9.]+@[A-Za-z.]+.(it|com|eu|org|net|edu)';
    if (username === '' ||  password === '') {
        valid = false;
        setErrorMessage('No empty fields allowed');
    } else if (!matchExact(regex,username)) {
        valid = false;
        setErrorMessage('Invalid email');
    } else if (password.length < 6) {
        valid = false;
        setErrorMessage('Password should be longer than 6');
    } 
    if(valid)
    { 
        let res = props.doLogin(credentials).then(() => {
            if(res!=null)
                setErrorMessage("Username doesn't exist or wrong password");
        });
        setValidated(true);
    }
    else {
        setValidated(false);
    }
};


  return (
    
    <Container>
            <Row>
            <Col xs={2}/>
            <Col xs={8} className='text-center' id='loginSquare'>
                <Card id='loginCard' >
                    <Card.Body>
                        <Card.Title className='loginLable'><h2>Login</h2></Card.Title>
                        {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Row className="spacing d-flex justify-content-around">
                            <Col xs={1}><Form.Label className='loginLable'>Username</Form.Label></Col>
                            <Col xs={7}><Form.Control
                                    className='loginLable'
                                    required
                                    type="email"
                                    value={username}
                                    onChange={ev => setUsername(ev.target.value)}
                                />
                                <Form.Control.Feedback type='invalid'/>
                                <Form.Control.Feedback type='valid' /> 
                            </Col>
                        </Form.Row>
                        <Form.Row className="spacing d-flex justify-content-around">
                            <Col xs={1}><Form.Label className='loginLable'>Password</Form.Label> </Col> 
                            <Col xs={7}>
                                <Form.Control
                                    className='loginLable'
                                    required
                                    type="password"
                                    value={password}
                                    minLength = {6}
                                    onChange={ev => setPassword(ev.target.value)}
                                />
                                <Form.Control.Feedback type='invalid'/>
                                <Form.Control.Feedback type='valid' /> 
                            </Col>
                        </Form.Row> 
                        <Button type='submit' variant="success" className='loginLable'>
                            Log in
                        </Button> 
                        </Form>
                    </Card.Body>
                </Card>
                </Col>
            <Col xs={2} />
            </Row>
        </Container>
    )
}



export {LoginPage};