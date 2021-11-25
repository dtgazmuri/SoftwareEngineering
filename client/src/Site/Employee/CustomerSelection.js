import { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";

function CustomerSelection(props) {

    const [customerName, setCustomerName] = useState("");
    const [customerlist, setCustomerList] = useState(
                props.customers.map((e, id) => {
                return <option key={`customer-${id}`} value={e.id}>  {e.name + " " + e.surname}  </option>}
    ));

    //this function takes the input inside the searchbar and filters all the customers according to the value written
    //in order to simplify the search, it is case insensitive.
    const handleFilterCustomer = (newName) => {
        setCustomerName(newName);
        let newCustomerlist = props.customers.map(customer => 
            {
                if(customer.name.toUpperCase().startsWith(newName.toUpperCase()) || customer.surname.toUpperCase().startsWith(newName.toUpperCase()))
                    return <option key={`customer-${customer.id}`} value={customer.id}>  {customer.name + " " + customer.surname}  </option>

            }
        );
        setCustomerList(newCustomerlist);
    }

    return (
        <Form align-items="center">
        <Row>
            <Col sm = {4}>
                <Form.Label className="mb-0">Select a client for the order using the dropdown</Form.Label>
                <Form.Text className="text-muted">
                    You can first filter your research by putting his/her name.
                </Form.Text>
            </Col>
            <Col sm = {3}>
                <Form.Control  type="text" placeholder="Search customer by name" value = {customerName} onChange={(event) => handleFilterCustomer(event.target.value)}/>       
            </Col>
            <Col sm = {5}>
                <Form.Control title="select-statement" as="select" aria-label="Please select a client" onChange={ev => props.handleCustomer(ev.target.value)}>
                    <option key={`customerdefault`} selected disabled hidden >---select---</option>
                    {customerlist}
                </Form.Control>
            </Col>
            
        </Row>
        </Form>
    )

}


export default CustomerSelection;