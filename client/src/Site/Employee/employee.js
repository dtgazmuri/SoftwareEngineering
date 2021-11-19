import { React, useState, useEffect } from 'react';
import { Col, Row, ListGroup, Form, Button, Alert } from "react-bootstrap";
import API from '../../EmployeeAPI'


/*
function Employee() {
    // CAMBIARE EMPLOYEE NAME
    var shopEmployeeName = "Diego";
    const [selectedFunction, setSelectedFunction] = useState("");
    const [orderList, setOrderList] = useState([]);

 
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

*/
function CustomerList() {
    const [walletUpdated, setWalletUpdated] = useState({status: false, id: -1, value: 0});
    const [alertWalletUpdated, setAlertWalletUpdated] = useState({});
    const [customers, setCustomerList] = useState([]);
    const [customerName, setCustomerName] = useState(""); //state used for searching a specific client
    const [customersToBeShown, setCustomersToBeShown] = useState([]);
    
    // show error message in toast
    const handleErrors = (err) => {
        console.log(err);
    }
    
    useEffect(() =>  {
            API.getCustomers()
                .then(all_customers => {
                    console.log(all_customers);
                    setCustomerList(all_customers);
                    setCustomersToBeShown(all_customers);
                })
                .catch(e => handleErrors(e));
    
      }, [])

    useEffect(() => {
        if (walletUpdated.status === true) {
            console.log("Qua");
            API.updateCustomerWallet(walletUpdated.value, walletUpdated.id)
                .then(res => {
                    console.log(res);
                    //read all the customer list and set the new wallet balance (the one passed in walletUpdated.value)
                    const tmp = customers.map((customer) => {
                        if(customer.id === walletUpdated.id)
                        {
                            customer.wallet =walletUpdated.value;
                        }
                        return customer
                    });
                    setCustomerList(tmp);
                    setCustomersToBeShown(tmp);
                    setAlertWalletUpdated({id: walletUpdated.id, variant: "success", msg: `Wallet of client ${walletUpdated.id} updated successfully.`});
                })
                .catch(e =>  {
                    handleErrors(e);
                    setAlertWalletUpdated({id: walletUpdated.id, variant: "danger", msg: `Unable to update wallet of client ${walletUpdated.id}.`});
                });
                console.log("Qua5");
                setWalletUpdated({status: false, id: -1, value: 0});
        }
    }, [walletUpdated, customers])

    const handleFilterCustomer = (newName) => {
        setCustomerName(newName);
        let newCustomerlist = customers.filter( customer =>
            (customer.name.toUpperCase().startsWith(newName.toUpperCase()) || customer.surname.toUpperCase().startsWith(newName.toUpperCase()) )
        );
        setCustomersToBeShown(newCustomerlist);
    }

    return (
        <>
            {/** The form is for filtering the list of customers to be shown*/}
            <Form className = "mb-3">
                <Row>
                    <Col sm = {6}>
                        <Form.Label>You can filter by customer name.</Form.Label>
                    </Col>
                    <Col sm = {6}>
                        <Form.Control  type="text" placeholder="Search customer by name" value = {customerName} onChange={(event) => handleFilterCustomer(event.target.value)}/>       
                    </Col>
                </Row>
            </Form>
            <ListGroup variant="primary">
                {customersToBeShown.length ?
                    customersToBeShown.map(customer => {
                        return (
                            <ListGroup.Item id = {customer.id} key = {customer.id}>
                                <Row>
                                    <Col>
                                        <h5>{customer.name + " " + customer.surname}</h5>
                                        <h5>ID: {customer.id} </h5>
                                        {/*<h5>Username: {customer.username}</h5>*/}
                                        <h5>Amount in Wallet: {customer.wallet} €</h5>
                                    </Col>
                                    <Col>
                                        <CustomerForm id = {customer.id} customers = {customers} alertWalletUpdated = {alertWalletUpdated}
                                        setCustomerList = {setCustomerList} setWalletUpdated = {setWalletUpdated} />
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        );
                    }

                    )
                    : <Alert variant = "danger"> No customers found </Alert>
                }
            </ListGroup>
        </>
    )
}

function CustomerForm(props) {
    const [amount, setAmount] = useState("");

    function walletTopUp(id, amount_to_add) {

        var value = Number(amount_to_add);
        props.customers.forEach((customer) => {
            if (customer.id === id) {
                var valore = customer.wallet + value;
                props.setWalletUpdated({status: true, id: id, value: valore});
            }
        })
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

function OrderList() {
    const [updateOrder, setUpdateOrder] = useState(-1);
    const [updated, setUpdated] = useState({});
    const [orders, setOrderList] = useState([]);


     // show error message in toast
    const handleErrors = (err) => {
        console.log(err);
    }


    useEffect(() => {
          API.getOrders()
            .then(all_orders => {
                console.log(all_orders);
                setOrderList(all_orders);
            })
            .catch(e => handleErrors(e));
      }, [])

   
    function handOutOrder(id) {
        var tmp = [];

        orders.forEach((order) => {
            if(order.id === id){
                order.state = "delivered";
                tmp.push(order);
            }
            else {
                tmp.push(order);
            }
        });
        setOrderList(tmp);
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
                {orders.length ?
                    orders.map(order => {
                        return (
                            <ListGroup.Item id = {order.id} key = {order.id}>
                                <h5>Order number: {order.id}</h5>
                                <Row>
                                <Col>
                                    <Row>Customer id: {order.customerid} </Row>
                                    <Row>Order state: {order.state} </Row>
                                    <Row>Order total: {order.total.toFixed(2)}</Row>
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
export {CustomerList,OrderList};