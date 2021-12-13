import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Container, Row, Col, ListGroup, Alert, Button, Form } from "react-bootstrap";
import { Link } from 'react-router-dom';

import { deliverybig, alarm } from '../icons';

//API
import API from '../../ManagerAPI'



function ManagerPage(props){

    return (
        <>
        <Container fluid className="below-nav vh-100 align-items-center">
            <Row id = "managerFunctions">
                <SeeFarmerOrdersButton /> 
            </Row>
        </Container>
        </>
      )
}

function SeeFarmerOrdersButton () {
    //this is a button shown in the mainpage of the manager that redirects to /manager/farmerOrders
    return(
        <Col lg = {4} sm = {6} id = "ackFarmerOrder">
            <Link to="/manager/farmerorders">
                <Container id="del-button" fluid className="LoginButton border border-dark rounded nolink mb-3" align="center" >
                {deliverybig}
                <h3>See farmer orders</h3>
                </Container>
            </Link>
        </Col>
    )
}
function ManagerPageFarmerOrders (props) {
    const [orders, setOrders] = useState([]);
    const [ordersToShow, setOrdersToShow] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orderToSearch, setOrderToSearch] = useState("");

    
    //orders from farmer are delivered from Monday 9:00 (after confirmation) to Tuesday evening (let's say 21:00)
    let validTime = false;
    const currentTime = dayjs(props.getCurrentTime()); //building the dayjs obj

    if(currentTime.day() === 1 && currentTime.hour() > 8) //if it's Monday after 8.59, can set ack
        validTime = true;
    if(currentTime.day() === 2 && currentTime.hour() < 21) //if it's Tuesday before 21, can set ack for delivery
        validTime = true;

    //use effect that when we type something in the searchbar, triggers the filtering
    useEffect(() => {
        const value = orderToSearch;
        if(value === ""){
            setOrdersToShow(orders);
            return;
        }
        const tmp = orders.filter( order => {
            if(order.id === Number.parseInt(value))
                return true;
            else if (order.farmerName.toUpperCase().startsWith(value.toUpperCase()))
                return true;
            else if (order.farmerSurname.toUpperCase().startsWith(value.toUpperCase()))
                return true;
            else if (order.state.toUpperCase().startsWith(value.toUpperCase()))
                return true;
            else if (order.listitems.find(item => item.name.toUpperCase().startsWith(value.toUpperCase())))
                return true;
            //missing search per product
        
            return false;
        });
        //TODO: complete this function
        setOrdersToShow(tmp);
    }, [orderToSearch, orders]);

    useEffect(() => {
        setLoading(true);
        API.getFarmerOrders()
            .then(all_orders => {
                setOrders(all_orders);
                setOrdersToShow(all_orders);
                setLoading(false);
            })
            .catch(e => {
                setLoading(false);
                setOrders([]);
                setOrdersToShow([]);
            }
            );
      }, [])
   

    return (
        <Col>
            {loading && <Alert variant='warning'> {alarm} Please wait while loading farmer orders... {alarm}</Alert>}
            {(orders.length && !loading) ?
                <ListGroup id="list" variant = "primary" className = "mb-5"> 
                    <ListGroup.Item variant="primary" key = "title">
                        <h5 id = "manager-farmer-orders-title">List of all the farmer orders</h5>
                    </ListGroup.Item>
                    <ListGroup.Item variant="secondary" key = "explaination">
                        <h6 id = "manager-farmer-orders-explaination">Delivery from farmers can be acknowledged from Monday 9:00 to Tuesday 21:00</h6>
                    </ListGroup.Item>
                    <ListGroup.Item variant="secondary" key = "search">
                        <Form>
                            <Form.Group controlId="manager-farmer-orders-searching">
                                <Form.Control value = {orderToSearch} placeholder = "Filter farmer orders by id, farmer name, farmer surname, state or product"
                                onChange={(event) => setOrderToSearch(event.target.value)}/>       
                            </Form.Group>
                        </Form>
                    </ListGroup.Item>
                    
                    {ordersToShow.map(order => {
                        return (
                            <FarmerOrderItem key = {order.id} order = {order} validTime = {validTime}/>  
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
    const [acked, setAcked] = useState(false);
    const [errorMsg, setErrorMsg] = useState(false);
    const [ackedSuccessfully, setAckedSuccessfully] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    
    let order = props.order;

    //useEffect for closing alert after 3 seconds
    useEffect(() => {
        if(ackedSuccessfully){
            window.setTimeout(()=>{
                setAckedSuccessfully(false);
              },3000)
        }
      }, [ackedSuccessfully]);
    
    const ackClicked = (orderid) => {
        setAcked(true);
        API.ackFarmerOrder(orderid)
            .then((newOrder) => {
                //returning an obj with id and state = "delivered"
                order.state = newOrder.state; 
                setAcked(false);
                setErrorMsg(false);
                //this alert of successfully acked will disappear in 3 seconds
                setAckedSuccessfully(true);
            })
            .catch(e => {
                setAcked(false);
                setErrorMsg(true);
            })
    }

    return (
        <ListGroup.Item id = {order.id} key = {order.id}>
            <Row key = "order-id">
                <h4><strong>Order id: {order.id}</strong></h4>
            </Row>
            <Row key = "order-info">
            <Col sm = {4}>
                {/**ORDER INFO */}
                <h5><strong>Order info</strong></h5>
                <p>
                    State: {acked ? <span className = "bg-warning">delivered</span> : <span>{order.state}</span>} <br></br>
                    Total: {order.total.toFixed(2)}€<br></br>
                    Date: {order.time}<br></br>
                </p>

                {!showDetails ?
                    <Button variant="link" className="p-0" onClick = {() => setShowDetails(true)}>Show more info</Button>
                :
                    <>
                    <Button variant="link" className="p-0" onClick = {() => setShowDetails(false)}>Hide more info</Button><br></br>
                    {/**This ol can be split into another function component */}
                    <ol data-testid="farmer-order-products">
                        {order.listitems.map(product => {
                            return <li key = {product.id}>
                                <span><strong className = "pr-3">{product.name}</strong></span>
                                <span className = "pr-3">Qty: <strong>{product.quantity}</strong></span>
                                <span>Total: <strong>{product.price}€</strong></span>
                            </li>
                        })}
                    </ol>
                    
                    </>
                }
                
            </Col>
            <Col sm = {4}>
                {/**FARMER INFO */}
                <h5><strong>Farmer info</strong></h5>
                <p>
                    Farmer id: {order.farmerid} <br></br>
                    Name: {order.farmerName} <br></br>
                    Surname: {order.farmerSurname}<br></br>
                </p>
            </Col>
            <Col sm = {4}>
                {/**CONTROLS AND ALERT */}
                {/**It's possible to set acknowledgment of delivery only at valid times */}
                {   (order.state === "pending" && props.validTime) &&
                        <Button className = "mb-3" onClick = {() => ackClicked(order.id)}>Acknowledge delivery</Button>
                }
                {   
                    errorMsg && <Alert variant = "danger">Error while trying to acknowledge delivery...</Alert>
                }
                {
                    ackedSuccessfully && <Alert variant = "success">Order n.{order.id} acked successfully</Alert>
                }
            </Col>
            </Row>
        </ListGroup.Item>  
    )
}

export {ManagerPage, ManagerPageFarmerOrders, FarmerOrderItem};