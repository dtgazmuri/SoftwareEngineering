import { Form, Button, Alert, Container, Col, Card, Row, Nav} from 'react-bootstrap';
import { useState } from 'react';



<<<<<<< HEAD
function matchExact(r, str) {
   var match = str.match(r);
   return match && str === match[0];
}

=======
>>>>>>> story-1-2-3

function LoginPage(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> 5cbd752809e454ab3c589a2bf1486cebde84076d


  const handleSubmit = (event) => {
      event.preventDefault();
      setErrorMessage('');
      const credentials = { username, password };
      
      let valid = {value: true, reason: "Attenzione! "}
      if (username === ''){
        valid.value = false
        valid.reason=valid.reason.concat("Username cannot be empty! ")
      }
      if (password === ''){
        valid.value = false
        valid.reason=valid.reason.concat("Password cannot be empty! ")
      }
      if (password.length < 6){
        valid.value = false
        valid.reason=valid.reason.concat("Password cannot be Less than 6 characters! ")
      }
      if (valid.value) {
        props.login(credentials);

      }
      else {
<<<<<<< HEAD
=======
        // show a better error message...
>>>>>>> 5cbd752809e454ab3c589a2bf1486cebde84076d
        setErrorMessage(valid.reason);
      }
  };

  return (
    
    <Container className="fluid below-nav">
    <Form>
      {errorMessage && <Alert variant='danger'>{errorMessage}</Alert>}
      <Form.Group controlId='username'>
          <Form.Label>email</Form.Label>
          <Form.Control type='email' value={username} onChange={ev => setUsername(ev.target.value)} />
      </Form.Group>
      <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
      </Form.Group>
      <Button onClick={handleSubmit}>Login</Button>
    </Form>
    </Container>)
>>>>>>> story-1-2-3
}



<<<<<<< HEAD
<<<<<<< HEAD
export {LoginPage};
=======
export default LoginPage;
>>>>>>> story-1-2-3
=======
export default LoginPage;
>>>>>>> 5cbd752809e454ab3c589a2bf1486cebde84076d
