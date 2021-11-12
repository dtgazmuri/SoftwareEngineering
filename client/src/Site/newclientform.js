import { Form, Button, Alert, Container, Row, Col, Modal } from 'react-bootstrap';
import { useState } from 'react';
import { Link, Navigate } from "react-router-dom";

function SignupForm(props) {
    const [submitted, setSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [validated, setValidated] = useState(false);
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        setValidated(false);
        setErrorMessage('');
        let valid = true;
        if (name === undefined || name === '') {
            valid = false;
            setErrorMessage("Please, enter the required fields");
        }
        else if (surname === undefined || surname === '') {
            valid = false;
            setErrorMessage("Please, enter the required fields");
        }
        else if (username === undefined || username === '') {
            valid = false;
            setErrorMessage("Please, enter the required fields");
        }
        else if (password === undefined || password === '') {
            valid = false;
            setErrorMessage("Please, enter the required fields");
        }


        if (valid) {
            const newcust = {name:name, surname:surname, username:username, password:password}
            console.log(newcust)
            try {
                props.addClient(newcust);
            setSubmitted(true);
            }
            catch(e){
                console.log(e)
            }
        }
        setValidated(true);
        props.handleClose();
    };

    return (
        <> 
        {submitted ? <></>
        :
        <Modal show = {props.show}>
          <Modal.Header closeButton>
            <Modal.Title>Add new Client</Modal.Title>
        </Modal.Header>
        <Modal.Body>
                    {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
                    <Form noValidate validated={validated}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                value={name}
                                onChange={ev => setName(ev.target.value)}
                            />
                            <Form.Control.Feedback type='invalid'>Field required</Form.Control.Feedback>
                            <Form.Control.Feedback type='valid' />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Surname</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                value={surname}
                                onChange={ev => setSurname(ev.target.value)}
                            />
                            <Form.Control.Feedback type='invalid'>Field required</Form.Control.Feedback>
                            <Form.Control.Feedback type='valid' />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                value={username}
                                onChange={ev => setUsername(ev.target.value)}
                            />
                            <Form.Control.Feedback type='invalid'>Field required</Form.Control.Feedback>
                            <Form.Control.Feedback type='valid' />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                required
                                type="password"
                                value={password}
                                onChange={ev => setPassword(ev.target.value)}
                            />
                            <Form.Control.Feedback type='invalid'>Field required</Form.Control.Feedback>
                            <Form.Control.Feedback type='valid' />
                        </Form.Group>
                    
                        <Row className="buttonRow d-flex justify-content-around" >
                            <Form.Group as={Col} xs={1} className="mb-5">
                                <Button onClick={handleSubmit}>Save</Button>
                            </Form.Group>
                            <Form.Group as={Col} xs={1} className="mb-5">
                                <Link to="/home"><Button variant='secondary' onClick = {props.handleClose}>Cancel</Button></Link>
                            </Form.Group>
                        </Row>
                    </Form>
                    </Modal.Body>
                    
        </Modal>
        }
        </>

    )
}

export { SignupForm };
