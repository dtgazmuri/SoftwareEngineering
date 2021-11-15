import { Container, ListGroup } from "react-bootstrap";
import React from "react";
import BasketItem from "./BasketItem";

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

  return (
    <Container className="below-nav justify-content-center">
      {items && (
        <ListGroup>
          {" "}
          {items.map((item) => (
            <BasketItem
              product={item}
              setChangeBasket={setChangeBasket}
              basket={true}
              notifyBalance={props.notifyBalance}
              notifyQuantity={props.notifyQuantity}
            />
          ))}{" "}
        </ListGroup>
      )}
    </Container>
  );
}

export default Basket;
