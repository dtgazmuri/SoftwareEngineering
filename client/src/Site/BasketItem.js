import React from "react";
import { ListGroup, Col, Row, Badge } from "react-bootstrap";
import BasketButton from "./BasketButton";



function BasketItem(props) {

  
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
            {props.product.price} €/kg
          </Badge>
          </Col>
        </ListGroup.Item>
      )}
    </>
  );
}
export default BasketItem;
