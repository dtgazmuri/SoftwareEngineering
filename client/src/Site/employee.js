import { React, useState, useEffect } from 'react';
import { Col, Container, Row, ListGroup, Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import API from '../EmployeeAPI'


function Employee() {
    var shopEmployeeName = "Diego";
    const [selectedFunction, setSelectedFunction] = useState("");
    const [orderNumber, setOrderNumber] = useState("");
    const [orderList, setOrderList] = useState([
        {id: 0, customer:1, state:"pending", delivery:"no", total: 31 },
        {id: 1, customer:1, state:"hanged out", delivery:"no", total: 26 },
        {id: 2, customer:2, state:"pending", delivery:"no", total: 12 }
    ]);

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
            </ListGroup>        
        </Col> 
        )
    
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