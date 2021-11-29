import { Form, Button, Alert, Container} from 'react-bootstrap';
import { useState } from 'react';

function LoginPage(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


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
        props.login(credentials); //passo alla funzione login il tipo di accesso

      }
      else {
        setErrorMessage(valid.reason);
      }
  };

  return (
    
    <Container className="fluid below-nav">
    <Form>
      {errorMessage && <Alert variant='danger'>{errorMessage}</Alert>}
      <Form.Group controlId='username' >
          <Form.Label>email</Form.Label>
          <Form.Control type='email' test-id="username" value={username} onChange={ev => setUsername(ev.target.value)} />
      </Form.Group>
      <Form.Group controlId='password' >
          <Form.Label>Password</Form.Label>
          <Form.Control type='password' test-id="password" value={password} onChange={ev => setPassword(ev.target.value)} />
      </Form.Group>
      <Button onClick={handleSubmit}>Login</Button>
    </Form>
    </Container>)
}

export default LoginPage;
