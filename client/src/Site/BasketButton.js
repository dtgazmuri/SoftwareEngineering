import React from "react";
import { Button } from "react-bootstrap";
import { CartPlus, CartDash, Code } from "react-bootstrap-icons";

// props.product => { id, name, price}   , props.mode {add or delete}
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
    };
    let isExist = false;
    for (let i = 0; i < basketItems.length; i++) {
      if (basketItems[i] == null) continue;
      if (basketItems[i].id === newItem.id) {
        if (mode == "add") basketItems[i].quantity++;
        if (mode == "delete" && basketItems[i].quantity >= 1) {
          basketItems[i].quantity--;
          if (basketItems[i].quantity == 0) delete basketItems[i];
        }
        sessionStorage.setItem("shopping-basket", JSON.stringify(basketItems));
        console.log(sessionStorage.getItem("shopping-basket"));
        return false;
      }
    }
    if (mode == "add") {
      if (isExist === false) {
        basketItems.push(newItem);
        sessionStorage.setItem("shopping-basket", JSON.stringify(basketItems));
      }
    }
  };

  return (
    <Button
      variant="success"
      onClick={() => addOrDeleteBasketItem(props.product, props.mode)}
    >
      {props.mode == "add" ? <CartPlus /> : <CartDash />}
    </Button>
  );
}

export default BasketButton;
