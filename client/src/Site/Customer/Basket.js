import { Row, Col, Container, ListGroup, Button, Card, Form, Modal, Table, Badge } from "react-bootstrap";
import { CartPlus, CartDash } from "react-bootstrap-icons";

import { Link } from "react-router-dom";
import React from "react";
import API from "../../API";

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

  const [customer, setCustomer] = React.useState({});

  React.useEffect(() => {
    const getCustomer = async (id) => {
        try {
          const customerInfo = await API.fetchCustomerById(id);
          setCustomer(customerInfo);
        } catch (err) {
          console.log(err.error);
        }
    };
    if (props.user) 
      getCustomer(props.user.userid);
    
  }, [props.user]);

  React.useEffect(() => {
    setItems(JSON.parse(sessionStorage.getItem("shopping-basket") || ""));
  }, [changeBasket]);

  const handleShow = () => {

    let good = true;
    setCartError(false);
    setCartErrorMessage("");
    console.log(items);

    let total = 0;

    for (let o of items) {
      total += o.price * o.quantity;
    }

    if (customer.wallet < total) {
      setCartError(true);
      setCartErrorMessage("You don't have enough money");
      good = false;
    }

    if (items.length <= 0 && good) {
      setCartError(true);
      setCartErrorMessage("Your cart is empty");
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
    let customerid = customer.id;
    for (let o of items) {
      total += o.price * o.quantity;
    }
    try {
      await API.postOrderByCustomer({ customerid: customerid, state: "pending", delivery: wantsDelivery, total: total, listitems: items, date: dateTime, address: deladd });
      props.setMessage({ type: "success", msg: `Order request added correctly. Now it has to be approved by an employee` });

    } catch (err) {
      console.log(err.error);
      props.setMessage({ type: "danger", msg: `Error on processing the order, try again` })
    }

    //Close modal
    setShow(false);
  }

  return (
    <>
      {Object.keys(customer).length !== 0 ? (
      <>
      <Container className="below-nav justify-content-center">
        {items && (
          <ListGroup>
            <ListGroup.Item
              as={Row}
              className="d-flex justify-content-between align-items-start"
            >
              <Col><b>Product Name</b></Col>
              <Col><b>Product Quantity (kg)</b></Col>
              <Col><b>Price</b></Col>
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
              <Col><b>Your wallet:
                <Badge pill bg="light" text="dark">
                  {customer.wallet.toFixed(2)} €
                </Badge></b>
              </Col>
              <Col></Col>
              <Col><b>Your total:
                <Badge pill bg="light" text="dark">
                  {total.toFixed(2)} €
                </Badge></b>
              </Col>
              
            </ListGroup.Item>

          </ListGroup>
        )}
        <br></br>
        <ConfirmDeliveryPanel handleDelivery={handleDelivery} address={address} setAddress={setAddress} delivery={delivery} date={date} time={time} setTime={setTime} setDate={setDate} handleShow={handleShow}></ConfirmDeliveryPanel>

        {
          cartError ?
            <ErrorCartModal handleClose={handleClose} show={show} errorMessage={cartErrorMessage} />
            :
            <RecapCart items={items} handleClose={handleClose} show={show} handleSubmit={handleSubmit} address={address} delivery={delivery} date={date} time={time} setOrderDate={setOrderDate} setOrderTime={setOrderTime} orderTime={orderTime} orderDate={orderDate} />
        }
      </Container>
      </>
      ) : (
        <h1>Loading</h1>
      )}
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
          <Row>
          <Col></Col>
            <Col>
              <Button variant="primary" onClick={() => props.handleShow()}>Place Order Request</Button>
            </Col>
            <Col></Col>
            <Col>
              <Link to={`/customer`}>
                <Button>Return</Button>
              </Link>
            </Col>
            <Col></Col>
          </Row>
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

export function BasketItem(props) {
  return (
    <>
      {props.product && (
        <ListGroup.Item
          as={Row}
          className="d-flex justify-content-between align-items-start"
        >
          <Col>
            <div className="fw-bold">{props.product.name}</div>
          </Col>
          <Col>
            <BasketButton
              product={props.product}
              mode={"add"}
              setChangeBasket={props.setChangeBasket}
              notifyBalance={props.notifyBalance}
              notifyQuantity={props.notifyQuantity}
            ></BasketButton>{" "}
            {props.product.quantity}{" "}
            <BasketButton
              product={props.product}
              mode={"delete"}
              setChangeBasket={props.setChangeBasket}
              notifyBalance={props.notifyBalance}
              notifyQuantity={props.notifyQuantity}
            ></BasketButton>{" "}
          </Col>
          <Col>
            <Badge pill bg="light" text="dark">
              {(props.product.price * props.product.quantity).toFixed(2)} €
            </Badge>
          </Col>
        </ListGroup.Item>
      )}
    </>
  );
}


// props.product => { id, name, price, quantity}   , props.mode {add or delete} , changeFlag
function BasketButton(props) {
  const addOrDeleteBasketItem = (product, mode) => {
    const basketItems = JSON.parse(
      sessionStorage.getItem("shopping-basket") || "[]"
    );

    const newItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      whQuantity: product.quantity,
    };
    let isExist = false;
    let total = 0;

    for (let i = 0; i < basketItems.length; i++) {
      if (basketItems[i].id === newItem.id) {
        if (mode === "add") {
          if (basketItems[i].quantity + 1 > basketItems[i].whQuantity) {
            props.notifyQuantity();
            return false;
          }
          basketItems[i].quantity++;
          total = total + basketItems[i].price * basketItems[i].quantity;
        }
        if (mode === "delete" && basketItems[i].quantity >= 1) {
          basketItems[i].quantity--;
          total = total - basketItems[i].price * basketItems[i].quantity;
          if (basketItems[i].quantity == 0) delete basketItems[i];
        }
        sessionStorage.setItem(
          "shopping-basket",
          JSON.stringify(basketItems.filter((x) => x != null))
        );
        console.log(
          JSON.parse(sessionStorage.getItem("shopping-basket") || "[]")
        );
        if (typeof props.setChangeBasket === "function")
          props.setChangeBasket((changeFlag) => (changeFlag ? false : true));
        if (total > props.wallet) props.notifyBalance();
        return false;
      }
    }

    if (mode === "add") {
      if (isExist === false) {
        basketItems.push(newItem);
        sessionStorage.setItem("shopping-basket", JSON.stringify(basketItems));
        total += newItem.price;
        if (total > props.wallet) props.notifyBalance();
      }
    }
    if (typeof props.setChangeBasket === "function")
      props.setChangeBasket((changeFlag) => (changeFlag ? false : true));
  };

  return (
    <Button
      size="sm"
      variant="success"
      onClick={() => addOrDeleteBasketItem(props.product, props.mode)}
    >
      {/* eslint-disable-next-line eqeqeq*/}
      {props.mode == "add" ? <CartPlus /> : <CartDash />}
    </Button>
  );
}


export  { Basket, BasketButton }