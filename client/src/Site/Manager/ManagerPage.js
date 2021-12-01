import { useState, useEffect } from 'react';
import { Container, Row, Col, ListGroup, Alert, Button } from "react-bootstrap";
import { Link } from 'react-router-dom';

import { deliverybig } from '../icons';

//API
import API from '../../ManagerAPI'



function ManagerPage(props){

    return (
        <>
        <Container fluid className="below-nav vh-100 align-items-center">
            <Row id = "managerFunctions">
                <AcknowledgeDeliveryButton /> 
            </Row>
        </Container>
        </>
      )
}

function AcknowledgeDeliveryButton (props) {
    return(
        <Col lg = {4} sm = {6} id = "ackFarmerOrder">
            <Link to="/manager/farmerorders">
                <Container fluid className="LoginButton border border-dark rounded nolink mb-3" align="center" >
                {deliverybig}
                <h3>See farmer orders</h3>
                </Container>
            </Link>
        </Col>
    )
}
function ManagerPageFarmerOrders (props) {
    const [orders, setOrders] = useState([]);


     // show error message in toast
    const handleErrors = (err) => {
        console.log(err);
    }


    useEffect(() => {
          API.getFarmerOrders()
            .then(all_orders => {
                console.log(all_orders);
                setOrders(all_orders);
            })
            .catch(e => handleErrors(e));
      }, [])
   
    function ackFarmerOrder(id) {
    
    }

    return (
        <Col>
            {orders.length ?
                <ListGroup variant = "primary"> 
                    <ListGroup.Item variant="primary">List of all the farmer orders</ListGroup.Item>
                    {orders.map(order => {
                        return (
                            <FarmerOrderItem order = {order} ackFarmerOrder = {ackFarmerOrder}/>  
                        ); 
                    })
                    }
                </ListGroup> 
            : <Alert variant='danger'>No orders found.</Alert>
            }     
        </Col>
    )
}

function FarmerOrderItem(props) {
    const [acked, setAcked] = useState({});

    const order = props.order;
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
                    <Button onClick = {() => props.ackFarmerOrder(order.id)}>Hand out order</Button>
                }
                {
                    (acked !== {}) &&
                        <Alert variant = {acked.variant} >{acked.msg}</Alert>
                }
            </Col>
            </Row>
        </ListGroup.Item>  
    )
}

export {ManagerPage, ManagerPageFarmerOrders};