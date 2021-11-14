import { Container, ListGroup, Row } from "react-bootstrap";
import React from "react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import BasketItem from "./BasketItem";
import BasketButton from "./BasketButton";

function Basket(props) {
  // const pathname = window.location.pathname.split("/")[2];
  const [items, setItems] = React.useState(
    JSON.parse(sessionStorage.getItem("shopping-basket") || "")
  );
  const [changeBasket, setChangeBasket] = React.useState(true);
  React.useEffect(() => {
    setItems(JSON.parse(sessionStorage.getItem("shopping-basket") || ""));
    //console.log(items);
  }, [changeBasket]);

  const product = {
    id: 12,
    name: "Orange",
    price: "10",
  };

  return (
    <Container className="below-nav justify-content-center">
      {items && (
        <ListGroup>
          {" "}
          {items.map((item) => (
            <BasketItem product={item} setChangeBasket={setChangeBasket} />
          ))}{" "}
        </ListGroup>
      )}
    </Container>
  );
}

export default Basket;
