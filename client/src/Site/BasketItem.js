import React from "react";
import { ListGroup, Badge } from "react-bootstrap";
import BasketButton from "./BasketButton";

function BasketItem(props) {
  return (
    <>
      {props.product && (
        <ListGroup.Item
          as="li"
          className="d-flex justify-content-between align-items-start"
        >
          <div className="ms-2 me-auto">
            <div className="fw-bold">{props.product.name}</div>
            <BasketButton
              product={props.product}
              mode={"add"}
              setChangeBasket={props.setChangeBasket}
            ></BasketButton>{" "}
            {props.product.quantity}{" "}
            <BasketButton
              product={props.product}
              mode={"delete"}
              setChangeBasket={props.setChangeBasket}
            ></BasketButton>{" "}
          </div>
          <Badge pill bg="light" text="dark">
            {props.product.price} €
          </Badge>
        </ListGroup.Item>
      )}
    </>
  );
}
export default BasketItem;
