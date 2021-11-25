import { Row, Col, Container, ListGroup, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import React from "react";
import BasketItem from "./BasketItem";

function Basket(props) {
  const [items, setItems] = React.useState(
    JSON.parse(sessionStorage.getItem("shopping-basket") || "")
  );
  const [changeBasket, setChangeBasket] = React.useState(true);

  React.useEffect(() => {
    setItems(JSON.parse(sessionStorage.getItem("shopping-basket") || ""));
  }, [changeBasket]);

  const [total, setTotal] = React.useState(0);

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

  return (
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
    </Container>
  );
}

export default Basket;
