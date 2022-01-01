import dayjs from 'dayjs';
import { React, useState, useEffect } from 'react';
import { Col, Container, Row, ListGroup, Form, Button, Alert, ListGroupItem } from "react-bootstrap";
import { Link } from "react-router-dom";
import API from '../../FarmerAPI'
import { littleX, confirmorder, setamount, } from '../icons';

//just printing on console every error
const handleErrors = (err) => {
    console.log(err);
}



export function FarmerPage(props) {
    return (
        <>
            <Container fluid className="below-nav vh-100 align-items-center">
                <Row id="farmerButtons">

                    <Col id="ShowProds">
                        <Link to="/farmer/yourproducts">
                            <Container id="prod-button" fluid className="LoginButton border border-dark rounded nolink mb-3" align="center" >
                                {setamount}
                                <h3>Set product amount</h3>
                            </Container>
                        </Link>
                    </Col>

                    <Col id="ConfirmOrders">
                        <Link to="/farmer/orders">
                            <Container id="order-button" fluid className="LoginButton border border-dark rounded nolink mb-3" align="center" >
                                {confirmorder}
                                <br></br><br></br>
                                <h3>Confirm Orders</h3>
                            </Container>
                        </Link>
                    </Col>


                </Row>
            </Container>
        </>
    )
}



export function FarmerProducts(props) {
    const [trueIfNeverSearchedProducts, setTrueIfNeverSearchedProducts] = useState(true);
    const [searchProducts, setSearchProducts] = useState(true);
    const [expectedQuantityForProduct, setExpectedQuantityForProduct] = useState({ id: -1, quantity: 0 });
    const [products, setProducts] = useState([]);
    const [updatedQuantity, setUpdatedQuantity] = useState({});

    //use effect for setting expected amount for a selected product
    useEffect(() => {
        if (expectedQuantityForProduct.id !== -1) {
            API.setExpectedQuantityForProduct(expectedQuantityForProduct.id, expectedQuantityForProduct.quantity)
                .then(res => {
                    setUpdatedQuantity(res);
                })
                .catch(e => handleErrors(e));
            setExpectedQuantityForProduct({ id: -1, quantity: 0 });
        }
    }, [expectedQuantityForProduct]);


    useEffect(() => {
        const getProducts = () => {
            if (searchProducts === true) {
                setTrueIfNeverSearchedProducts(false);
                console.log(props.user.userid)
                API.getProductsOfFarmer(props.user.userid)
                    .then(farmer_products => {
                        setProducts(farmer_products);
                        console.log(products)
                    })
                    .catch(e => handleErrors(e));
            }
            setSearchProducts(false);
        }
        setSearchProducts(true)
        getProducts();
    }, []);

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


    return (<>
        {searchProducts === true && <Alert variant='warning'>🕗Please wait while loading products...🕗</Alert>}
        {(trueIfNeverSearchedProducts === false && products.length === 0) &&
            <Alert variant='danger'>Sorry, no products found for the specified farmer.</Alert>
        }
        {products.length !== 0 &&
            <ProductList products={products} setExpectedQuantityForProduct={setExpectedQuantityForProduct} updatedQuantity={updatedQuantity}
                getCurrentTime={props.getCurrentTime} />
        }
    </>)
}


export function ProductList(props) {

    return (
        <Container>
            <ListGroup variant="primary">
                {props.products.length &&
                    <>
                        <ListGroup.Item id="farmer-products-title" key="farmer-products-title" variant="primary">
                            <h5 className="text-left">Here is your product list</h5>
                        </ListGroup.Item>
                        {
                            props.products.map(product => {
                                return (
                                    <ListGroup.Item id={product.id} key={product.id}>
                                        <h5>{product.name}</h5>
                                        <Row>
                                            <Col sm={4} md={6}>
                                                <Row>Product id: {product.id} </Row>
                                                <Row>Product price: {product.price} </Row>
                                            </Col>
                                            <Col sm={4} md={6}>
                                                <ProductForm id={product.id} updatedQuantity={props.updatedQuantity}
                                                    setExpectedQuantityForProduct={props.setExpectedQuantityForProduct}
                                                    getCurrentTime={props.getCurrentTime} />
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                );
                            })
                        }
                    </>
                }
            </ListGroup>
        </Container>
    )
}

export function ProductForm(props) {
    const [amount, setAmount] = useState(0);
    const [error, setError] = useState("");
    const [show, setShow] = useState(true);
    const [showWarning, setShowWarning] = useState(false);


    //need to check if it's possible to set amount
    //amounts of products can be set only between Monday after 9 and Saturday at 9:00
    //amounts cannot be set on Sundays
    let invalidTime = false;
    const currentTime = dayjs(props.getCurrentTime()); //building the dayjs obj
    if (currentTime.day() === 0 || (currentTime.day() === 1 && currentTime.hour() < 9) || (currentTime.day() === 6 && currentTime.hour() > 8)) {
        invalidTime = true;
        //"Sorry, amounts cannot be set between Saturday at 9 and Monday at 9.");
    }


    function handleSetAmount(id, quantity) {
        if (quantity > -1) {
            props.setExpectedQuantityForProduct({ id: id, quantity: quantity });
            setError("");
            setShow(true);
        }
        else {
            setError("Impossible to set a negative/undefined amount. If you think you won't have this product next week, set 0");
            setShowWarning(true);
        }
    }

    return (
        <>
            {invalidTime ?
                <Alert variant="warning">Sorry, expected availabilities cannot be set between Saturday at 9 and Monday at 9. </Alert>
                :
                <Form>
                    <Form.Group controlId={`amountOf${props.id}`} className="mb-3">
                        <Form.Control size="sm" type="number" placeholder="Insert here the expected amount" value={amount} onChange={(event) => setAmount(event.target.value)} />
                    </Form.Group>
                    {(error !== "" && showWarning) &&
                        <Alert variant='warning'>
                            <Row>
                                <Col>{error}</Col>
                                <Col lg={1}><Button variant="outline-warning" className="p-0" onClick={() => setShowWarning(false)}>{littleX}</Button></Col>
                            </Row>
                        </Alert>
                    }
                    {(props.updatedQuantity.product === props.id && show) &&
                        <Alert variant='success'>
                            <Row>
                                <Col>Availability of product {props.id} updated successfully. New availability: {props.updatedQuantity.quantity}</Col>
                                <Col lg={1}><Button variant="outline-success" className="p-0" onClick={() => setShow(false)}>{littleX}</Button></Col>
                            </Row>
                        </Alert>
                    }
                    <Button onClick={() => handleSetAmount(props.id, amount)}>Set expected amount</Button>
                </Form>
            }
        </>
    );
}



export function ConfirmOrdersSection(props) {

    const [orders, setOrders] = useState([]);



    useEffect(() => {
        const getOrders = async (id) => {
            try {
                const orders = await API.getOrdersOfFarmer(id);
                const filterOrd = orders.filter(function (o) { return o.status === "pending"; });
                setOrders(filterOrd);
            } catch (err) {
                console.log(err.error);
            }
        };
        getOrders(props.user.userid);

    }, []);
    let invalidTime = false;
    const currentTime = dayjs(props.getCurrentTime()); //building the dayjs obj
    if ((currentTime.day() === 7 && currentTime.hour() > 23) || (currentTime.day() === 1 && currentTime.hour() < 9)) {
        invalidTime = true;
        //Orders can only be confirmed from Monday at 9 am to Sunday at 11 pm
    }

    return (
        <>
            {!invalidTime ?
                <Col>
                    <ListGroup variant="primary">
                        <ListGroup.Item id="farmer-products-title" key="farmer-products-title" variant="primary">
                            <h5 className="text-left">Here is your list of orders to be confirmed</h5>
                        </ListGroup.Item>
                        {orders.length ?
                            orders.map(order => {
                                if (order.status === "pending") {
                                    return (
                                        <>
                                            <ListGroup.Item id={order.id} key={order.id}>
                                                <h5>Order number: {order.id}</h5>
                                                <Row>
                                                    <Col sm={4} md={6}>
                                                        <Row>Product name:</Row>
                                                    </Col>
                                                    <Col sm={4} md={6}>
                                                        <Row>Quantity:</Row>
                                                    </Col>
                                                </Row>
                                                {order.products.map(product => {
                                                    return (
                                                        <Row>
                                                            <Col sm={4} md={6}>
                                                                <Row>{product.name}</Row>
                                                            </Col>
                                                            <Col sm={4} md={6}>
                                                                <Row>{product.quantity}</Row>
                                                            </Col>
                                                        </Row>
                                                    )
                                                })}
                                            </ListGroup.Item>
                                            <ListGroupItem>
                                                <Button onClick={() => API.confirmOrder(order.id)}>Confirm order</Button>
                                            </ListGroupItem>
                                        </>
                                    );
                                }
                            })
                            :
                            <Alert variant='danger'>No orders found.</Alert>
                        }

                    </ListGroup>
                </Col>
                :
                <Alert variant='danger'>Orders can be confirmed only from Monday at 9 am to Sunday at 11 pm</Alert>
            }
        </>
    );
}
