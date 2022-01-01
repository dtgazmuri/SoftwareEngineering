import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Form, Button, Table, Modal, Container, Card, OverlayTrigger, Popover, Row, Col, Alert } from "react-bootstrap";
import API from "../../API";

import '../../App.css';


function Information(props) {
    return (
        <OverlayTrigger
            rootCloseEvent="mousedown"
            overlay={
                <Popover style={{ margin: 0 }}>
                    <Popover.Header as="h3">Quantity per Package</Popover.Header>
                    <Popover.Body>
                        The quantity of product for each package is {props.quantity} g.
                    </Popover.Body>
                </Popover>
            }
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
            </svg>
        </OverlayTrigger>


    )
}


export function UnregisteredUserProductList(props) {

    const [products, setProducts] = useState([]); //list of available products

    //PRODUCTS FETCH
    useEffect(() => {
        const getProducts = async () => {
            try {
                const current_products = await API.fetchAllProducts();
                console.log(current_products);
                setProducts(current_products);
            } catch (err) {
                //setLogged(false)
                console.log(err.error);
            }
        };
        getProducts();
    }, []);

    const checkTime = () => {
        let day = dayjs(props.time).get("d");
        let hour = dayjs(props.time).get("h");
        if (day !== 0 || (hour < 23 && day === 0))
            return true
        else
            return false;
    }

    return (
        <>
            <Card>
                <Card.Header as="h5" className="bg-primary text-light"><b>Product List</b></Card.Header>
                <Card.Body>

                {/* ALERT ABOUT TIME */}
                {
                    checkTime() ?
                    <>
                        {/* NOTHING */}
                    </>
                    :
                    <>
                        <Alert variant="danger">
                            WARNING: after Sunday at 23:00 product orders can't be placed, so this product list may refer to products that have just been sold.
                        </Alert>
                    </>
                }

                {/* PRODUCT TABLE */}
                <UnregisteredProductTable productList={products}></UnregisteredProductTable>

                </Card.Body>

                
            </Card>
        </>
    )

}

//Create the table
export function UnregisteredProductTable(props) {

    const list = props.productList.map((prod, id) => {
        return <UnregisteredProductTableRow productData={prod} productIndex={id} />;
    });

    return (
        <Table id="table-prod" responsive className="table-prod">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Farmer</th>
                    <th>Price/Package</th>
                    <th>Availability</th>
                </tr>
            </thead>
            <tbody>
                {list}
            </tbody>
        </Table>
    );
}

//Create the table row
export function UnregisteredProductTableRow(props) {

    const prod = props.productData;
    const id = props.productIndex;

    return (

        <>
            <tr data-testid={`product-item-${id}`} test-id={`product-item-${id}`} key={"prod" + id} >
                <td>{prod.name}</td>
                <td>{prod.farmer.name + " " + prod.farmer.surname}</td>
                <td>{prod.price} € <Information quantity={prod.quantity} /></td>
                <td>{prod.availability}</td>
            </tr>
        </>
    );

}