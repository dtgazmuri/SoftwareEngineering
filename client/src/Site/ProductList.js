import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import BasketButton from "./BasketButton";

import API from "../API";

function ProductList(props) {
  const [products, setProducts] = useState([]);

  //PRODUCTS FETCH
  useEffect(() => {
    const getProducts = async () => {
      try {
        const all_products = await API.fetchAllProducts();
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
      <tr>
        <td>{prod.id}</td>
        <td>{prod.name}</td>
        <td>{prod.farmer.name + " " + prod.farmer.surname}</td>
        <td>{prod.price} €</td>
        <td>{prod.quantity} kg</td>
        <td>
          <BasketButton
            product={prod}
            mode={"add"}
            notifyBalance={props.notifyBalance}
            wallet={props.wallet}
            notifyQuantity={props.notifyQuantity}
          ></BasketButton>{" "}
        </td>
        <td>
          <BasketButton
            product={prod}
            mode={"delete"}
            notifyBalance={props.notifyBalance}
            wallet={props.wallet}
            notifyQuantity={props.notifyQuantity}
          ></BasketButton>{" "}
        </td>
      </tr>
    );
  });

  return (
    <>
      <Table responsive className="table-prod">
        <thead>
          <tr>
            <th>#</th>
            <th>Product Name</th>
            <th>Farmer</th>
            <th>Price of 1 kg</th>
            <th>Expected Quantity</th>
            <th>Add to the Basket</th>
          </tr>
        </thead>
        <tbody>{productlist}</tbody>
      </Table>
    </>
  );
}

export default ProductList;
