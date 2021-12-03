import { Row, Col, Container, ListGroup, Button, Card, Form, Modal, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import React from "react";
import BasketItem from "./BasketItem";
import API from "../API";

function Basket(props) {

  const [date, setDate] = React.useState();
  const [time, setTime] = React.useState();
  const [delivery, setDelivery] = React.useState(false);
  const [address, setAddress] = React.useState("");
  const [items, setItems] = React.useState(
    JSON.parse(sessionStorage.getItem("shopping-basket") || "")
  );
  const [changeBasket, setChangeBasket] = React.useState(true);
  const [show, setShow] = React.useState(false)

  const [orderTime, setOrderTime] = React.useState();
  const [orderDate, setOrderDate] = React.useState();

  //Error in cart
  const [cartError, setCartError] = React.useState(false);
  const [cartErrorMessage, setCartErrorMessage] = React.useState("");

  React.useEffect(() => {
    setItems(JSON.parse(sessionStorage.getItem("shopping-basket") || ""));
  }, [changeBasket]);

  const handleShow = () => {

    let good = true;
    setCartError(false);
    setCartErrorMessage("");
    console.log("User:");
    console.log(props.user);

    if (items.length <= 0 && good) {
        setCartError(true);
        setCartErrorMessage("Cart is empty");
        good = false;
    }

    if (date === undefined && good) {
        setCartError(true);
        setCartErrorMessage("Please set a date");
        good = false;
    }

    if (time === undefined && good) {
        setCartError(true);
        setCartErrorMessage("Please set a time");
        good = false;
    }

    if (address === "" && good && delivery) {
        setCartError(true);
        setCartErrorMessage("Please enter the delivery address");
        good = false;
    }


    setShow(true);
  }

  const handleClose = () => {
    setShow(false);
  }

  const [total, setTotal] = React.useState(0);

  //SET DELIVERY BOOL
  const handleDelivery = (() => {
    if (delivery) {
        setDelivery(false);
    }
    else {
        setDelivery(true);
    }
});

  React.useEffect(() => {
    const basketItems = JSON.parse(
      sessionStorage.getItem("shopping-basket") || "[]"
    );
    let cost = 0;
    for (let i = 0; i < basketItems.length; i++) {
      cost = cost + basketItems[i].price * basketItems[i].quantity;
    }
    setTotal(cost);
  }, [changeBasket]);

  const handleSubmit = async () => {

    let total = 0;
    // Delivery --> True or False
    // Address  --> If Delivery is True, then client's entered address. Else, "Shop"
    let wantsDelivery = "False";
    let deladd = "Shop";
    if (delivery && address != "") {
        deladd = address;
        wantsDelivery = "True";
    }
    let deliveryDate = orderDate;
    let deliveryTime = orderTime;
    let dateTime = deliveryDate + " " + deliveryTime;
    let customerid = props.user.id;
    for (let o of items) {
        total += o.price * o.quantity;
    }
    try {
        await API.postOrderByCustomer({ customerid: customerid, state: "pending", delivery: wantsDelivery, total: total, listitems: items, date: dateTime, address: deladd});
        //props.setMessage({ type: "success", msg: `Order added correctly` })

    } catch (err) {
        console.log(err.error);
        //props.setMessage({ type: "danger", msg: `Error on processing the order, try again` })
    }

    //Close modal
    setShow(false);
}

  return (
    <>
      <Container className="below-nav justify-content-center">
        {items && (
          <ListGroup>
            <ListGroup.Item
              as={Row}
              className="d-flex justify-content-between align-items-start"
            >
              <Col>Product Name</Col>
              <Col>Product Quantity (kg)</Col>
              <Col>Price</Col>
            </ListGroup.Item>

            {items.map((item) => (
              <BasketItem
                product={item}
                setChangeBasket={setChangeBasket}
                basket={true}
                notifyBalance={props.notifyBalance}
                notifyQuantity={props.notifyQuantity}
              />
            ))}

            <ListGroup.Item as={Row} className="d-flex justify-content-between align-items-start">
              <Col>Your total: {total.toFixed(2)} €</Col>
              <Col></Col>
              <Col>
                {items.length != 0 &&
                <Link to={`/customer`}>
                  <Button>Place Order Request</Button>
                </Link>
                }
              </Col>
            </ListGroup.Item>

          </ListGroup>
        )}
        <br></br>
        <Link to={`/customer`}>
          <Button>Return</Button>
        </Link>
        <ConfirmDeliveryPanel handleDelivery={handleDelivery} address={address} setAddress={setAddress} delivery={delivery} date={date} time={time} setTime={setTime} setDate={setDate} handleShow={handleShow}></ConfirmDeliveryPanel>

        {
          cartError ?
            <ErrorCartModal handleClose={handleClose} show={show} errorMessage={cartErrorMessage} />
            :
            <RecapCart items={items} handleClose={handleClose} show={show} handleSubmit={handleSubmit} address={address} delivery={delivery} date={date} time={time} setOrderDate={setOrderDate} setOrderTime={setOrderTime} orderTime={orderTime} orderDate={orderDate}/>
        }
      </Container>
  </>
  );
}


//Create the confirm delivery panel
export function ConfirmDeliveryPanel(props) {
  return (
      <Container fluid>
          <Card>
              <Card.Body>
                  <Card.Title>Order Confirmation</Card.Title>
                  <div class="h-divider" />
                  <Card.Text>
                      <Form.Group controlId="form-date">
                          <Form.Label>Date</Form.Label>
                          <Form.Control title="insert-date" type="date" className="mb-3" name="date" format="dd/MM/yyyy" value={props.date} onChange={(ev) => props.setDate(ev.target.value)} />
                      </Form.Group>
                      <Form.Group controlId="form-deadline-time">
                          <Form.Label>Time</Form.Label>
                          <Form.Control title="insert-time" type="time" name="time" value={props.time} onChange={(ev) => props.setTime(ev.target.value)} />
                      </Form.Group>
                  </Card.Text>
                  <br />
                  <Card.Text>
                      <Form.Group controlId="delivery">
                          <Form.Check
                              title="insert-delivery"
                              type="checkbox"
                              label="Delivery at home?"
                              onChange={() => props.handleDelivery()}
                              inline
                          />
                      </Form.Group>

                      {
                          props.delivery ?
                              <Form.Group className="mb-3" controlId="delivery">
                                  <Form.Control type="address" placeholder="Enter Address" value={props.address} onChange={ev => props.setAddress(ev.target.value)} />
                              </Form.Group>
                              :
                              <></>
                      }

                  </Card.Text>
                  <div class="h-divider" />
                  <br />
                  <ListGroup.Item className="d-flex justify-content-between align-items-start">
                    <Col>
                      <Button variant="primary" onClick={() => props.handleShow()}>Confirm Order Request</Button>
                    </Col>
                    <Col>
                      <Link to={`/customer`}>
                        <Button>Return</Button>
                      </Link>
                    </Col>
                  </ListGroup.Item>

              </Card.Body>
          </Card>
      </Container>
  );
}

export function ErrorCartModal(props) {
  return (
      <Modal show={props.show} title="cart-error-modal">
          <Modal.Header closeButton={props.handleClose}>
              <Modal.Title>Error</Modal.Title>
          </Modal.Header>

          <Modal.Body>
              <div>
                  {props.errorMessage}
              </div>
              <div>
                  <Button variant='secondary' onClick={props.handleClose}>Ok</Button>
              </div>
          </Modal.Body>



      </Modal>
  );
}

export function RecapCart(props) {

  let total = 0
  let total_weight = 0;
  for (let o of props.items) {
      total += o.price * o.quantity;
      total_weight += o.quantity;
  }
  const cartlist = props.items.map((item) => {
      return (
          <>
              <tr id={item.id}>
                  <th>{item.name}</th>
                  <th>{item.quantity}</th>
                  <th>{(item.price * item.quantity).toFixed(2)} €</th>
              </tr>
          </>
      );
  })


  return (
      <Modal show={props.show} >
          <Modal.Header closeButton={props.handleClose}>
              <Modal.Title>Order Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <h5>Your Products</h5>
              <Table>
                  <thead>
                      <tr id="header">
                          <th>NAME</th>
                          <th>QTA</th>
                          <th>€</th>
                      </tr>
                  </thead>

                  <tbody>
                      {cartlist}
                  </tbody>

                  <tfoot>

                      <tr>
                          <td>
                              <b>Total:</b>
                          </td>

                          <td>
                              {
                                  total_weight
                              }
                          </td>

                          <td>
                              {
                                  total.toFixed(2)
                              }
                              &nbsp;€
                          </td>
                      </tr>

                  </tfoot>

              </Table>

              <h5>Delivery Details</h5>
              <Table>
                  <tbody>
                      <tr>
                          <td>
                              <b>Delivery Address:</b>
                          </td>
                          <td colSpan="2">
                              {
                                  props.delivery ? props.address : "Pick-up at the shop"
                              }
                          </td>
                      </tr>

                      <tr>
                          <td><b>Delivery Date:</b></td>
                          <td colSpan="2">{`${props.date} at ${props.time}`}</td>
                          {props.setOrderDate(props.date)}
                          {props.setOrderTime(props.time)}
                      </tr>

                  </tbody>
              </Table>

              <Button onClick={props.handleSubmit}>Save</Button>
              &nbsp;
              &nbsp;
              &nbsp;
              <Button variant='secondary' onClick={props.handleClose}>Cancel</Button>

          </Modal.Body>

      </Modal>
  )
}

export default Basket;
