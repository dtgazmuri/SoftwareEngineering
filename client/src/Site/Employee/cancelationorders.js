import { React, useState, useEffect } from 'react';
import { Col, Row, ListGroup, Alert } from "react-bootstrap";
import API from '../../EmployeeAPI'

function CancelationOrderList() {
    const [orders, setOrders] = useState([]);

    // show error message in toast
    const handleErrors = (err) => {
        console.log(err);
    }

    useEffect(() => {
        API.getOrdersWithInsufficientWalletBalance()
            .then(result => {
                setOrders(result);
            })
            .catch(e => handleErrors(e));
    }, [])

    return (
        <Col>
            <ListGroup variant="primary">
                {orders.length ?
                    orders.map(order => {
                        if (order.state !== "delivered") {
                            return (
                                <ListGroup.Item id={order.id} key={order.id}>
                                    <h5>Order number: {order.id}</h5>
                                    <Row className="tablePadding">
                                        <Col>
                                            <Row>Customer id: {order.customerid} </Row>
                                            <Row>Customer name: {order.customerName} </Row>
                                            <Row>Customer surname: {order.customerSurname}</Row>
                                        </Col>
                                        <Col>
                                            <Row>Customer username: {order.customerUsername} </Row>
                                            <Row>Customer wallet: {order.customerWallet} </Row>
                                            <Row>Order total: {order.total.toFixed(2)}</Row>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            );
                        }
                    })
                    : <Alert variant='danger'>No orders found.</Alert>

                }
            </ListGroup>
        </Col>
    )
}
export { CancelationOrderList };