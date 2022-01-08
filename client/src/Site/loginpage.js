import { Form, Button, Alert, Card } from 'react-bootstrap';
import { useState } from 'react';

function LoginPage(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage('');
    const credentials = { username, password };

    let valid = { value: true, reason: "Warning! " }
    if (username === '') {
      valid.value = false
      valid.reason = valid.reason.concat("Username cannot be empty! ")
    }
    if (password === '') {
      valid.value = false
      valid.reason = valid.reason.concat("Password cannot be empty! ")
    }
    if (password.length < 6) {
      valid.value = false
      valid.reason = valid.reason.concat("Password cannot be Less than 6 characters! ")
    }
    if (valid.value) {
      props.login(credentials); //passo alla funzione login il tipo di accesso

    }
    else {
      setErrorMessage(valid.reason);
    }
  };

  return (

    <Card>
      <Card.Header as="h5" className="bg-primary text-light"><b>Login Form</b></Card.Header>
      <Card.Body>
        <Form>
          {errorMessage && <Alert variant='danger'>{errorMessage}</Alert>}
          <Form.Group controlId='username' >
            <Form.Label><b>Email (Username)</b></Form.Label>
            <Form.Control type='email' title="insert-email" test-id="username" value={username} onChange={ev => setUsername(ev.target.value)} />
          </Form.Group>
          &nbsp;
          <Form.Group controlId='password' >
            <Form.Label><b>Password</b></Form.Label>
            <Form.Control type='password' title="insert-password" test-id="password" value={password} onChange={ev => setPassword(ev.target.value)} />
          </Form.Group>
        </Form>

        <br />
        <Button test-id="login-button" onClick={handleSubmit}>Login</Button>
      </Card.Body>
    </Card>

  )
}

export default LoginPage;
