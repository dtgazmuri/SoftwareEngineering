import { React, useState, useEffect } from 'react';
import { Col, Container, Row, ListGroup, Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import API from '../EmployeeAPI'


function Employee() {
    // CAMBIARE EMPLOYEE NAME
    var shopEmployeeName = "Diego";
    const [selectedFunction, setSelectedFunction] = useState("");
    const [walletUpdated, setWalletUpdated] = useState({status: false, id: -1, value: 0});
    const [orderList, setOrderList] = useState([]);
    const [alertWalletUpdated, setAlertWalletUpdated] = useState({});
    /*
    const [customerList, setCustomerList] = useState([
        {id: 0, name: "Guglielmo", surname: "!!!", username: "Gugli 69!", hash: "123456", wallet: 420},
        {id: 1, name: "Diego", surname: "!!!", username: "dg", hash: "123456", wallet: 100},
        {id: 2, name: "Lorenzo", surname: "!!!", username: "Lorenzo1", hash: "123456", wallet: 0}
    ])*/
    const [customerList, setCustomerList] = useState([]);

     // show error message in toast
    const handleErrors = (err) => {
        console.log(err);
    }


    useEffect(() => {
        if (selectedFunction === "HandOut") {
          API.getOrders()
            .then(orders => {
                console.log(orders);
                setOrderList(orders);
            })
            .catch(e => handleErrors(e));
        } 
        
        else if (selectedFunction === "WalletTopUp") {
            API.getCustomers()
                .then(customers => {
                    console.log(customers);
                    setCustomerList(customers);
                })
                .catch(e => handleErrors(e));
        }
      }, [selectedFunction])

    useEffect(() => {
        if (walletUpdated.status === true) {
            console.log("Qua");
            API.updateCustomerWallet(walletUpdated.value, walletUpdated.id)
                .then(res => {
                    console.log(res);
                    //read all the customer list and set the new wallet balance (the one passed in walletUpdated.value)
                    const tmp = customerList.map((customer) => {
                        if(customer.id === walletUpdated.id)
                        {
                            customer.wallet =walletUpdated.value;
                        }
                        return customer
                    });
                    setCustomerList(tmp);
                    setAlertWalletUpdated({id: walletUpdated.id, variant: "success", msg: `Wallet of client ${walletUpdated.id} updated successfully.`});
                })
                .catch(e =>  {
                    handleErrors(e);
                    setAlertWalletUpdated({id: walletUpdated.id, variant: "danger", msg: `Unable to update wallet of client ${walletUpdated.id}.`});
                });
                console.log("Qua5");
                setWalletUpdated({status: false, id: -1, value: 0});
        }
    }, [walletUpdated])

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
                    <CustomerList customers = {customerList} setCustomerList = {setCustomerList}
                    setWalletUpdated = {setWalletUpdated} alertWalletUpdated = {alertWalletUpdated}/>
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
                                        <CustomerForm id = {customer.id} customers = {props.customers} alertWalletUpdated = {props.alertWalletUpdated}
                                        setCustomerList = {props.setCustomerList} setWalletUpdated = {props.setWalletUpdated} />
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

        var value = Number(amount);
        //var tmp = [];
        props.customers.forEach((customer) => {
            if (customer.id === id) {
                // customer.wallet += value;
                var valore = customer.wallet + value;
                props.setWalletUpdated({status: true, id: id, value: valore});
                //tmp.push(customer);
            }
            /*
            else {
                tmp.push(customer);
            }*/
        })
        //props.setCustomerList(tmp);
    }

    return (
        <Form>
            {props.alertWalletUpdated.id === props.id &&
                <Alert variant = {props.alertWalletUpdated.variant}>{props.alertWalletUpdated.msg}</Alert>
            }
            <Form.Group controlId={props.id} className = "mb-3">
                <Form.Control size = "lg" type="text" placeholder="Insert amount to add to wallet" value = {amount} onChange={(event) => setAmount(event.target.value)}/>       
            </Form.Group>
            <Button onClick={() => walletTopUp(props.id, amount)}>Submit</Button>
        </Form>
    );
}

function OrderList(props) {
    const [updateOrder, setUpdateOrder] = useState(-1);
    const [updated, setUpdated] = useState({});
    function handOutOrder(id) {
        var tmp = [];

        props.orders.forEach((order) => {
            if(order.id === id){
                order.state = "delivered";
                tmp.push(order);
            }
            else {
                tmp.push(order);
            }
        });
        props.setOrderList(tmp);
        setUpdateOrder(id);
    }

    useEffect(() => {
        if (updateOrder !== -1) {
            API.handOutOrder(updateOrder)
                .then(res => {
                    setUpdated({id: updateOrder, variant: "success", msg: `Order number ${updateOrder} was updated successfully.`});
                })
                .catch(e => 
                    setUpdated({id: updateOrder, variant: "danger", msg: `Unable to update order number ${updateOrder}.`})
                );
                setUpdateOrder(-1);
           }
    }, [updateOrder])

    return (
        <Col>
            <ListGroup variant = "primary"> 
                {props.orders.length ?
                    props.orders.map(order => {
                        return (
                            <ListGroup.Item id = {order.id} key = {order.id}>
                                <h5>Order number: {order.id}</h5>
                                <Row>
                                <Col>
                                    <Row>Customer id: {order.customerid} </Row>
                                    <Row>Order state: {order.state} </Row>
                                    <Row>Order total: {order.total}</Row>
                                </Col>
                                <Col>
                                    {   order.state === "pending" &&
                                        <Button onClick = {() => handOutOrder(order.id)}>Hand out order</Button>
                                    }
                                    {
                                        (updated !== {} && updated.id === order.id) &&
                                            <Alert variant = {updated.variant} >{updated.msg}</Alert>
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