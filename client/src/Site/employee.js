import { React, useState, useEffect } from 'react';
import { Col, Container, Row, ListGroup, Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import API from '../EmployeeAPI'


function Employee() {
    // CAMBIARE EMPLOYEE NAME
    var shopEmployeeName = "Diego";
    const [selectedFunction, setSelectedFunction] = useState("");
    const [orderNumber, setOrderNumber] = useState("");
    const [orderList, setOrderList] = useState([
        {id: 0, customer:1, state:"pending", delivery:"no", total: 31 },
        {id: 1, customer:1, state:"hanged out", delivery:"no", total: 26 },
        {id: 2, customer:2, state:"pending", delivery:"no", total: 12 }
    ]);
    const [customerList, setCustomerList] = useState([
        {id: 0, name: "Guglielmo", surname: "!!!", username: "Gugli 69!", hash: "123456", wallet: 420},
        {id: 1, name: "Diego", surname: "!!!", username: "dg", hash: "123456", wallet: 100},
        {id: 2, name: "Lorenzo", surname: "!!!", username: "Lorenzo1", hash: "123456", wallet: 0}
    ])

     // show error message in toast
    const handleErrors = (err) => {
        console.log(err);
    }

    
    useEffect(() => {
        if (selectedFunction === "HandOut") {
          API.getOrders()
            .then(orders => {
                console.log(orders);
              //setOrderList(orders);
            })
            .catch(e => handleErrors(e));
        } 
        
        else if (selectedFunction === "WalletTopUp") {
            API.getCustomers()
            //API.getOrders()
                .then(customers => {
                    console.log(customers);
                    // setCustomerList(customers);
                })
                .catch(e => handleErrors(e));
        }
      }, [selectedFunction])

    const handleSubmit = (event) => { 
    }

    return(
        <Container className="below-nav justify-content-center">
            <Row>
                <h1>Main page for the shop employee {shopEmployeeName}</h1>
            </Row>
            <Row className ="my-3" align="center">
                <EmployeeSidebar selectedFunction = {selectedFunction} setSelectedFunction = {setSelectedFunction} />
                { selectedFunction === "HandOut" && 
                    <OrderList orders = {orderList} setOrderList = {setOrderList}/>
                }
                { selectedFunction === "WalletTopUp" && 
                    <CustomerList customers = {customerList} setCustomerList = {setCustomerList}/>
                }
            </Row>

        </Container>
    )
}

function EmployeeSidebar (props) {
    return( 
        <Col className="d-sm-block col-12 bg-light" sm= {4} id="employee-sidebar">
            <ListGroup variant = "flush">
                <Link to={{pathname: `/employee`}} onClick={() => props.setSelectedFunction('HandOut')}>
                    <ListGroup.Item active = { props.selectedFunction === "HandOut"} id = "HandOut" key = "HandOut">Hand out order</ListGroup.Item>    
                </Link>
                <br/>
                <Link to={{pathname: `/employee`}} onClick={() => props.setSelectedFunction('WalletTopUp')}>
                    <ListGroup.Item active = { props.selectedFunction === "WalletTopUp"} id = "WalletTopUp" key = "WalletTopUp">Top up client wallet</ListGroup.Item>    
                </Link>
            </ListGroup>        
        </Col> 
        )
    
}

function CustomerList(props) {
    function walletTopUp(id, amount) {
        var value = Number(amount);
        var tmp = []
        props.customers.forEach((customer) => {
            if (customer.id === id) {
                customer.wallet += value;
                tmp.push(customer);
            }
            else {
                tmp.push(customer);
            }
        })
        props.setCustomerList(tmp);
    }

    return (
        <Col>
            <ListGroup variant="primary">
                {props.customers.length ?
                    props.customers.map(customer => {
                        return (
                            <ListGroup.Item id = {customer.id} key = {customer.id}>
                                <Row>
                                    <Col>
                                        <h5>{customer.name + " " + customer.surname}</h5>
                                        <h5>ID: {customer.id} </h5>
                                        <h5>Username: {customer.username}</h5>
                                        <h5>Amount in Wallet: {customer.wallet} </h5>
                                    </Col>
                                    <Col>
                                        <CustomerForm id = {customer.id} customers = {props.customers} setCustomerList = {props.setCustomerList} />
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        );
                    }

                    )
                    : <Alert variant = "danger"> No customers found </Alert>
                }
            </ListGroup>
        </Col>
    )
}

function CustomerForm(props) {
    const [amount, setAmount] = useState("");
    function walletTopUp(id, amount) {
        console.log(id);
        console.log(amount);
        
        var value = Number(amount);
        var tmp = [];
        props.customers.forEach((customer) => {
            if (customer.id === id) {
                customer.wallet += value;
                tmp.push(customer);
            }
            else {
                tmp.push(customer);
            }
        })
        props.setCustomerList(tmp);
    }

    return (
        <Form>
            <Form.Group controlId={props.id} className = "mb-3">
                <Form.Control size = "lg" type="text" placeholder="Insert amount to add to wallet" value = {amount} onChange={(event) => setAmount(event.target.value)}/>       
            </Form.Group>
            <Button onClick={() => walletTopUp(props.id, amount)}>Submit</Button>
        </Form>
    );
}

function OrderList(props) {
    function handOutOrder(id) {
        var tmp = [];
        //console.log(props.orders);
        props.orders.forEach((order) => {
            if(order.id === id){
                order.state = "hanged out";
                tmp.push(order);
            }
            else {
                tmp.push(order);
            }
        });
        props.setOrderList(tmp);
        
    }

    return (
        <Col>
            <ListGroup variant = "primary"> 
                {props.orders.length ?
                    props.orders.map(order => {
                        return (
                            <ListGroup.Item id = {order.id} key = {order.id}>
                                <h5>{order.id}</h5>
                                <Row>
                                <Col>
                                    <Row>Customer id: {order.customer} </Row>
                                    <Row>Order state: {order.state} </Row>
                                    <Row>Order total: {order.total}</Row>
                                </Col>
                                <Col>
                                    {   order.state === "pending" &&
                                        <Button onClick = {() => handOutOrder(order.id)}>Hand out order</Button>
                                    }
                                </Col>
                                </Row>
                            </ListGroup.Item>    
                        ); 
                    })
                    : <Alert variant='danger'>No orders found.</Alert>

                }     
            </ListGroup> 
        </Col>
    )
}
export default Employee;