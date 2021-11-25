import { React, useState, useEffect } from 'react';
import { Col, Row, ListGroup, Button, Alert } from "react-bootstrap";
import API from '../../EmployeeAPI'

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
export {OrderList};