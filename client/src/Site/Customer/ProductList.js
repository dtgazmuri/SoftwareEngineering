import { useEffect, useState } from "react";
import { OverlayTrigger, Popover, Table } from "react-bootstrap";
import {BasketButton, returnQuantity} from "./Basket";

import API from "../../API";



function Information(props){
  return(
  <OverlayTrigger
      trigger={["hover", "focus"]}
      rootCloseEvent="mousedown"
      overlay={
        <Popover>
          <Popover.Header as="h3">Quantity per Package</Popover.Header>
          <Popover.Body>
            The quantity of product for each package is {props.quantity} g.
          </Popover.Body>
        </Popover>
      }
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
       <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
       <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
      </svg>
    </OverlayTrigger>
  
  
  )}



function ProductList(props) {
  const[updated, setUpdated] = useState(false);

  let ini_prod_list = [];
  if (props.debug_product_list){
    ini_prod_list = props.debug_product_list;
  }

  const [products, setProducts] = useState(ini_prod_list);

  //PRODUCTS FETCH
  useEffect(() => {
    const getProducts = async () => {
      try {
        const all_products = await API.fetchAllProducts();
        setUpdated(true);
        setProducts(all_products);
      } catch (err) {
        //setLogged(false)
        console.log(err.error);
      }
    };
    getProducts();
  }, []);

  const productlist = products.map((prod, id) => {
    return (
      <tr test-id={`product-item-${prod.id}`}>
        <td >{prod.id}</td>
        <td>{prod.name}</td>
        <td>{prod.farmer.name + " " + prod.farmer.surname}</td>
        <td>{prod.price} € <Information quantity={prod.quantity}/></td>
        <td>{prod.availability}</td>
        <td>
        <BasketButton
            product={prod}
            mode={"add"}
            notifyBalance={props.notifyBalance}
            wallet={props.wallet}
            notifyQuantity={props.notifyQuantity}
            setUpdated={setUpdated}
          ></BasketButton>{" "}
        </td>
        <td id="booked">
          {returnQuantity(prod.id)}
        </td>
        <td>
          <BasketButton
            product={prod}
            mode={"delete"}
            notifyBalance={props.notifyBalance}
            wallet={props.wallet}
            notifyQuantity={props.notifyQuantity}
            setUpdated={setUpdated}
          ></BasketButton>{" "}
        </td>
      </tr>
    );
  });

  return (
    <>
      <Table id="table-prod" responsive className="table-prod">
        <thead>
          <tr>
            <th>#</th>
            <th>Product Name</th>
            <th>Farmer</th>
            <th>Price/Package</th>
            <th>Availability</th>
            <th>Add to the Basket</th>
            <th>Quantity</th>
            <th>Remove from the Basket</th>
          </tr>
        </thead>
        <tbody>{productlist}</tbody>
      </Table>
    </>
  );
}

export default ProductList;
