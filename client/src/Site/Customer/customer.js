import { Button, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductList from "./ProductList";
import API from "client/src/API.js";
import "react-toastify/dist/ReactToastify.css";

function CustomerHome(props) {
  const [customer, setCustomer] = useState({});
  // const [customerId, setId] = useState(props.user.userid)

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
              <h3>Amout on your wallet: {customer.wallet} €</h3>
            </Col>

            <Link to={`/customer/${customer.id}/basket`}>
              <Button>Basket</Button>
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
