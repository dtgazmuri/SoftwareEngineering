import { Form, Button, Alert, Row, Col, Card } from "react-bootstrap";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
    shopemployee,
    customer,
    /*farmer,
    delivery,
    warehouse,
    manager,*/
} from "./icons.js";
import API from "../API";

function SignupForm(props) {
    const [submitted, setSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [validated, setValidated] = useState(false);
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rpassword, setRPassword] = useState("");
    const [role, setRole] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        setValidated(false);
        setErrorMessage("");
        let valid = true;
        if (name === undefined || name === "") {
            valid = false;
            setErrorMessage("Please, enter the required fields!");
        } else if (surname === undefined || surname === "") {
            valid = false;
            setErrorMessage("Please, enter the required fields!");
        } else if (username === undefined || username === "") {
            valid = false;
            setErrorMessage("Please, enter the required fields!");
        } else if (password === undefined || password === "") {
            valid = false;
            setErrorMessage("Please, enter the required fields!");
        } else if (rpassword === undefined || rpassword === "") {
            valid = false;
            setErrorMessage("Please, enter the required fields!");
        } else if (password !== rpassword) {
            valid = false;
            setErrorMessage("The two passwords need to be the same!");
        } else if (role === undefined || role === "") {
            valid = false;
            setErrorMessage("Please, select a role you want to sing up as!");
        }

        if (valid) {
            console.log("adding new user");
            API.addNewUser({
                name: name,
                surname: surname,
                username: username,
                password: password,
                role: role,
            }).then(() => {
                props.notifySuccess();
            }).catch(() => { props.notifyError(); });
            setSubmitted(true);
        }
        setValidated(true);
    };

    return (
        <> {submitted ? <Navigate replace to="/home" /> :
            <>

                <Card>
                    <Card.Header as="h5" className="bg-primary text-light"><b>Sign Up Form</b></Card.Header>
                    <Card.Body>
                        {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
                        <Form noValidate validated={validated}>
                            <Form.Group className="mb-3">
                                <Form.Label><b>Name</b></Form.Label>
                                <Form.Control
                                    required
                                    test-id="name"
                                    title="name-insertion"
                                    type="text"
                                    value={name}
                                    onChange={ev => setName(ev.target.value)}
                                />
                                <Form.Control.Feedback type='invalid'>Field required</Form.Control.Feedback>
                                <Form.Control.Feedback type='valid' />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label><b>Surname</b></Form.Label>
                                <Form.Control
                                    required
                                    test-id="surname"
                                    title="surname-insertion"
                                    type="text"
                                    value={surname}
                                    onChange={ev => setSurname(ev.target.value)}
                                />
                                <Form.Control.Feedback type='invalid'>Field required</Form.Control.Feedback>
                                <Form.Control.Feedback type='valid' />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label><b>Username</b></Form.Label>
                                <Form.Control
                                    required
                                    test-id="username"
                                    title="username-insertion"
                                    type="email"
                                    value={username}
                                    onChange={ev => setUsername(ev.target.value)}
                                />
                                <Form.Control.Feedback type='invalid'>Field required</Form.Control.Feedback>
                                <Form.Control.Feedback type='valid' />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label><b>Password</b></Form.Label>
                                <Form.Control
                                    required
                                    type="password"
                                    test-id="password1"
                                    title="password1-insertion"
                                    value={password}
                                    onChange={ev => setPassword(ev.target.value)}
                                />
                                <Form.Control.Feedback type='invalid'>Field required</Form.Control.Feedback>
                                <Form.Control.Feedback type='valid' />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label><b>Repeat Password</b></Form.Label>
                                <Form.Control
                                    required
                                    test-id="password2"
                                    type="password"
                                    title="password2-insertion"
                                    value={rpassword}
                                    onChange={ev => setRPassword(ev.target.value)}
                                />
                                <Form.Control.Feedback type='invalid'>Field required</Form.Control.Feedback>
                                <Form.Control.Feedback type='valid' />
                            </Form.Group>

                            <h3 className="text-center text-sm-center spacing">
                                Please select the type of account you want to sign up to:
                            </h3>
                            <Row className="my-3" align="center">
                                <Col className="py-3">
                                    {role === "customer" ? (
                                        <Button

                                            onClick={() => setRole("customer")}
                                            className="nolink btn-primary"
                                        >
                                            {customer}
                                            <h2>Customer</h2>
                                        </Button>
                                    ) : (
                                        <Button
                                            test-id="customer-button"

                                            onClick={() => setRole("customer")}
                                            className="nolink btn-outline-primary btn-light"
                                        >
                                            {customer}
                                            <h2>Customer</h2>
                                        </Button>
                                    )}
                                </Col>
                                <Col className="py-3">
                                    {role === "shopemployee" ? (
                                        <Button
                                            test-id="shopemployee-button"
                                            onClick={() => setRole("shopemployee")}
                                            className="nolink btn-primary"
                                        >
                                            {shopemployee}
                                            <h2>Shop Employee</h2>
                                        </Button>
                                    ) : (
                                        <Button
                                            test-id="shopemployee-button"

                                            onClick={() => setRole("shopemployee")}
                                            className="nolink btn-outline-primary btn-light"
                                        >
                                            {shopemployee}
                                            <h2>Shop Employee</h2>
                                        </Button>
                                    )}
                                </Col>
                            </Row>
                            <Row className="buttonRow d-flex justify-content-around">
                                
                                <Form.Group as={Col} xs={1} className="mb-5">
                                    <Button test-id="save-button" onClick={handleSubmit}>Save</Button>
                                </Form.Group>
                                
                                <Form.Group as={Col} xs={1} className="mb-5">
                                    <Link to="/home">
                                        <Button variant="secondary">Cancel</Button>
                                    </Link>
                                </Form.Group>
                            </Row>
                        </Form>

                    </Card.Body>
                </Card>
            </>
        }
        </>
    );
}

export { SignupForm };
