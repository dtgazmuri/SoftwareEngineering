import { React, useState, useEffect } from 'react';
import API from '../../EmployeeAPI';
import API2 from '../../API';
import { Row, Col, ListGroup, Alert, Button, Form } from "react-bootstrap";
import dayjs from 'dayjs';

function ReportLostFood(props) {
    const [orders, setOrderList] = useState([]);
    const [insert, setInsert] = useState(false);
    const [showOrderList, setShowOrderList] = useState(false);
    const [productAmount, setProductAmount] = useState();
    const [alert, setAlert] = useState("Please enter all data properly");
    const [error, setError] = useState(true);

    const [productList, setProductList] = useState([]);

    const [productName, setProductName] = useState(""); //state used for searching a specific product
    const [productsToBeShown, setProductsToBeShown] = useState([]);
    const [products, setProducts] = useState(
        productsToBeShown.map((e) => {
            return <option key = {e.id} value={e.id}>  {e.name}  </option>}
    ));
    const [selectedProduct, setSelectedProduct] = useState();

    // This will only be available once hand out time is over
    // This will mean that the order was definetly not handed out
    let invalidTime = false;
    const currentTime = dayjs(props.getCurrentTime());
    if (currentTime.day() === 7 || (currentTime.day() === 6) || (currentTime.day() === 5 && currentTime.hour() >= 21))
        invalidTime = false;
    else
        invalidTime = true;
    
    const handleErrors = (err) => {
        console.log(err);
    }

    const showInsert = () => {
        if (insert) {
            setInsert(false);
        }
        else {
            setInsert(true);
        }
    }

    const showOrders = () => {
        if (showOrderList) {
            setShowOrderList(false);
        }
        else {
            setShowOrderList(true);
        }
    }

    useEffect(() => {
        API.getOrders()
            .then(all_orders => {
                console.log(all_orders);
                setOrderList(all_orders);
            })
            .catch(e => handleErrors(e));
    }, [])

    useEffect(() => {
        API2.fetchAllProducts()
            .then(all_products => {
                console.log(all_products);
                //setProducts(all_products);
                setProductsToBeShown(all_products);
                setProductList(all_products);
            })
            .catch(e => handleErrors(e));
    }, [])

    const handleFilterProduct = (input) => {
        setProductName(input);
        let newProducts = productsToBeShown.map(product => {
            if (product.name.toUpperCase().startsWith(input.toUpperCase())) {
                return <option key = {product.id} value={product.id}>{product.name}</option>
            }
        }
        );
        setProducts(newProducts);
    }

    const handleSelectedProduct = (product) => {
        setSelectedProduct(product);
    }

    const handleProductAmount = (value) => {
        console.log(value);
        setProductAmount(value);
    }

    const handleCheck = () => {
        let productInt = parseFloat(productAmount);
        if (isNaN(productInt)) {
            setAlert("Quantity entered is not a number");
        }
        else if (productInt <= 0 || !Number.isInteger(productInt)) {
            setAlert("Please enter a valid quantity");
        }
        else if (!selectedProduct) {
            setAlert("Please select a product");
        }
        else {
            setAlert("Lost product amount entered successfully");
            setError(false);
            handlePostLostFood();
        }
    }

    const handlePostLostFood = () => {
        let date = props.getCurrentTime().split(" ");
        let dateArray = date[1].split("/");
        let product;
        for (let i = 0; i < productList.length ; i++){
            if (productList[i].id === selectedProduct) {
                product = productList[i];
                break;
            }
        }
        let monthArray = {
            "January": 1,
            "February": 2,
            "March": 3,
            "April": 4,
            "May": 5,
            "June": 6,
            "July": 7,
            "August": 8,
            "September": 9,
            "October": 10,
            "November": 11,
            "December": 12,
        }

        let dateCorrectFormat = dateArray[2] + "-" + monthArray[dateArray[1]] + "-" + dateArray[0];

        // Needed data: product name, quantity, date, month (int), productid
        const productData = {
            name: product.name,
            quantity: parseInt(productAmount),
            date: dateCorrectFormat,
            month: monthArray[dateArray[1]],
            productid: product.id,
        }
        console.log(productData);
        API.postLostFood(productData);
        //setAlert(response);
    }

    return (
        <>
            <ListGroup id="list" variant = "primary" >
                <ListGroup.Item variant="primary" key = "title">
                    <h2>Report Lost Products</h2>
                </ListGroup.Item>
                <ListGroup.Item variant="light" key = "information">
                    <h6>Food that is not received by a client is lost. Report here when an entire order or a specific product is lost.</h6>
                </ListGroup.Item>
            </ListGroup>
            <br></br>

            {(!invalidTime) ?

            <>
                <ListGroup id="list" variant = "primary" >
                    <ListGroup.Item action variant="primary">
                        <h6 onClick={() => {showInsert(); handleFilterProduct("")}}>Insert lost product</h6>
                    </ListGroup.Item>

                    {(insert) ? 
                        <>
                        <ListGroup.Item>
                            <Form className="mb-3">
                                <Row>
                                    <Col>
                                        <Form.Label>You can filter by product name.</Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Control test-id="filter" type="text" placeholder="Search product" value={productName} onChange={(event) => handleFilterProduct(event.target.value)} />
                                    </Col>
                                    <Col>
                                        <Form.Control id="filter-select" title="select-statement" as="select" aria-label="Please select a product" onChange={ev => handleSelectedProduct(ev.target.value)}>
                                            <option key={`customerdefault`} selected disabled hidden >---select---</option>
                                            {products}
                                        </Form.Control>
                                    </Col>
                                </Row>
                                <br></br>
                                <Row>
                                    <Col>
                                        {(error) ?
                                            <Alert>{alert}</Alert>
                                        : <Alert variant="success">{alert}</Alert>
                                        }
                                    </Col>
                                    <Col>
                                        <Form.Control test-id="value" type="int" placeholder="Amount lost" onChange={(event) => handleProductAmount(event.target.value)} />
                                    </Col>
                                    <Col>
                                        <Button onClick={handleCheck}>Confirm</Button>
                                    </Col>
                                </Row>
                            </Form>
                        </ListGroup.Item>
                        </>
                    : <></>
                    }

                    <ListGroup.Item action variant="primary">
                        <h6 onClick={showOrders}>Report that an entire order was lost</h6>
                    </ListGroup.Item>

                    {(showOrderList) ? 

                        orders.map(order => {
                            if (order.state === 'pending') {
                                return (
                                    <DisplayOrder order={order} productList={productList} getCurrentTime={props.getCurrentTime}/>
                                )
                            }
                        })
                    : <></>
                    }
                </ListGroup>
            </>

            : 
            <Alert variant='danger'>Orders not handed out can only be reported between Fridays at 21:00 and Sundays at 23:59.</Alert>
            }
            <br></br>
        </>
    )
}

function DisplayOrder(props) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [orderStatusChanged, setOrderStatusChanged] = useState(false);
    const [showButtons, setShowButtons] = useState(true);
    const [alert, setAlert] = useState("Are you sure? This can't be undone");
    const [alertStatus, setAlertStatus] = useState("primary");

    const showConfirmButton = () => {
        if (showConfirm) {
            setShowConfirm(false);
        }
        else {
            setShowConfirm(true);
        }
    }

    const changeOrderStatus = () => {
        setOrderStatusChanged(true);
    }

    const hideButtons = () => {
        setShowButtons(false);
    }

    const confirmLostOrder = () => {
        console.log(props.order);

        let date = props.getCurrentTime().split(" ");
        let dateArray = date[1].split("/");

        let monthArray = {
            "January": 1,
            "February": 2,
            "March": 3,
            "April": 4,
            "May": 5,
            "June": 6,
            "July": 7,
            "August": 8,
            "September": 9,
            "October": 10,
            "November": 11,
            "December": 12,
        }

        let dateCorrectFormat = dateArray[2] + "-" + monthArray[dateArray[1]] + "-" + dateArray[0];

        let productList = props.productList;
        if (props.order.products.length > 0) {
            let length = props.order.products.length;
            let products = props.order.products;
            for (let i = 0; i < length; i++) {
                let product = products[i];
                let productId = product.productid;
                let currentProduct;
                for (let j = 0; j < productList.length; j++) {
                    if (productId === productList[j].id) {
                        currentProduct = productList[j];
                        break;
                    }
                }
                const productData = {
                    name: currentProduct.name,
                    quantity: parseInt(product.quantity),
                    date: dateCorrectFormat,
                    month: monthArray[dateArray[1]],
                    productid: productId,
                }
                console.log(productData);
                API.postLostFood(productData);
            }
            API.lostOrderStatus(props.order.id);
            setAlert("Food from order reported as lost correctly");
            setAlertStatus("success");
            
        }
        else {
            // Set alert that says the order is empty, so nothing was posted
            // API.lostOrderStatus(props.order.id);
            setAlert("Error: Order is empty");
            setAlertStatus("danger");
        }
    }

    return (
        <>
            <ListGroup.Item>
                <Row>
                    <Col>
                        <h6>Order number {props.order.id}</h6>
                        {(props.order.products.length > 0) ?
                            <h6>Items in order: {props.order.products.length}</h6>
                            : <h6>Order Empty</h6>
                        }
                    </Col>
                    <Col>
                        {(showButtons) ?
                            <Button onClick={showConfirmButton}>Report as lost</Button>
                            : <></>
                        }
                    </Col>
                    <Col>
                        {(showConfirm && !orderStatusChanged) ? 
                            <Alert variant={alertStatus}>{alert}</Alert>
                            : <></>
                        }
                        {(showConfirm && orderStatusChanged) ?
                            <Alert variant={alertStatus}>{alert}</Alert>
                            : <></>
                        }
                    </Col>
                    <Col>
                        {(showConfirm && showButtons) ? 
                            <Button onClick={() => {changeOrderStatus(); hideButtons(); confirmLostOrder()}}>Confirm</Button>
                            : <></>
                        }
                    </Col>
                </Row>
            </ListGroup.Item>
        </>
    )
}

export {ReportLostFood, DisplayOrder};