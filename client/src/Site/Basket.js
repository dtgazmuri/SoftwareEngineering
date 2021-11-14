import { Container } from "react-bootstrap";
import React from "react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import BasketButton from "./BasketButton";

function Basket(props) {
  // const pathname = window.location.pathname.split("/")[2];
  const product = {
    id: 5,
    name: "Apple",
    price: "tt",
  };

  return (
    <Container className="below-nav justify-content-center">
      <BasketButton product={product} mode={"add"}></BasketButton>{" "}
      <BasketButton product={product} mode={"delete"}></BasketButton>{" "}
    </Container>
  );
}

export default Basket;
