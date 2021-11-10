import { Link } from 'react-router-dom';
import {Container, Button, Col, Row, InputGroup, Form } from 'react-bootstrap';
import { Formik  } from 'formik';
 import * as yup from 'yup';

function MyPage(props) {
    
    return (
            <>
        

            <Container fluid className ="below-nav vh-100">
               <h1> Benvenuto, {props.user.username} </h1>
               <Container>

                    <FormExample/>
               </Container>
            </Container>
            </>
    )
}
    
function FormExample() {
    const schema = yup.object().shape({
      firstName: yup.string().required(),
      lastName: yup.string().required(),
      username: yup.string().required(), //aggiungere unicita
      password: yup.string().required().min(4),
      repeatpassword: yup.string()
      .oneOf([yup.ref('password'), null], 'Passwords must match'),
    });
  return (
        <Formik
        validationSchema={schema}
        onSubmit={console.log}
        autoComplete="off"
        initialValues={{
            firstName: '',
            lastName: '',
            username: '',
            password: '',
            repeatpassword: '',
        }}
        >
          {({
              handleSubmit,
              handleChange,
              handleBlur,
            values,
            touched,
            errors,
        }) => (
            <Form noValidate autoComplete ="off" onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Form.Group as={Col} md="4" controlId="validationFormik01">
                  <Form.Label>First name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={values.firstName}
                    
                    onChange={handleChange}
                    isValid={touched.firstName && !errors.firstName}
                    />
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="validationFormik02">
                  <Form.Label>Last name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={values.lastName}
                    onChange={handleChange}
                    isValid={touched.lastName && !errors.lastName}
                    />

                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="validationFormikUsername">
                  <Form.Label>Username</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type="email"
                      placeholder="Username"
                      name="username"
                      autocomplete="off"

                      value={values.username}
                      onChange={handleChange}
                      isInvalid={!!errors.username}
                      />
                    <Form.Control.Feedback type="invalid">
                      {errors.username}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Row>
              <Row className="mb-3">
              <Form.Group as={Col} md="4" controlId="validationFormikPassword">
                  <Form.Label>Password</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type="password"
                      placeholder=""
                      name="password"
                      autoComplete="off"

                      value={values.password}
                      onChange={handleChange}
                      isInvalid={!!errors.password}
                      
                      />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="validationFormikPassword2">
                  <Form.Label>Repeat password</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type="password"
                      placeholder=""
                      name="repeatpassword"
                      autoComplete="off"
                      value={values.repeatpassword}
                      onChange={handleChange}
                      isInvalid={!!errors.repeatpassword}
                      />
                    <Form.Control.Feedback type="invalid">
                      {errors.repeatpassword}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                </Row>
              <Button type="submit" onClick={handleSubmit(values)}>Submit form</Button>
            </Form>
          )}
        </Formik>
      );
}



export default MyPage;
