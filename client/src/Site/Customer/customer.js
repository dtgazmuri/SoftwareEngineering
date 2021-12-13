import { Button, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductList from "./ProductList";
import API from "../../API";
import "react-toastify/dist/ReactToastify.css";

function CustomerHome(props) {
  const [customer, setCustomer] = useState({});

  useEffect(() => {
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

  return (
    <>
      {customer !== {} ? (
        <>
          <Row>
            <Col xs={11}>
              <h3 id="wallet">Amount on your wallet: {customer.wallet} €</h3>
            </Col>

            <Link to={`/customer/${customer.id}/basket`}>
              <Button id="basket">Basket</Button>
            </Link>
          </Row>
          <ProductList
            notifyBalance={props.notifyBalance}
            wallet={customer.wallet}
            notifyQuantity={props.notifyQuantity}
          />
        </>
      ) : (
        <h1>Loading</h1>
      )}
    </>
  );
}

export { CustomerHome };
