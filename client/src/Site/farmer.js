import dayjs from 'dayjs';
import { React, useState, useEffect } from 'react';
import { Col, Container, Row, ListGroup, Form, Button, Alert } from "react-bootstrap";
import API from '../FarmerAPI'
import {littleX} from './icons';


function Farmer(props) {
    const farmerName = "Farmer1";
    const [trueIfNeverSearchedProducts, setTrueIfNeverSearchedProducts] = useState(true);
    const [farmerToSearch, setFarmerToSearch] = useState("");
    const [searchProducts, setSearchProducts] = useState(false);
    const [expectedQuantityForProduct, setExpectedQuantityForProduct] = useState({id: -1, quantity: 0});
    const [products, setProducts] = useState([]);
    const [updatedQuantity, setUpdatedQuantity] = useState({});
    
    //just printing on console every error
    const handleErrors = (err) => {
        console.log(err);
    }

    //use effect for searching products of farmer when he wants to
    useEffect(() => {
        if (searchProducts === true) {
            setTrueIfNeverSearchedProducts(false);
        
          API.getProductsOfFarmer(farmerToSearch)
            .then(farmer_products => {
                setProducts(farmer_products);
            })
            .catch(e => handleErrors(e));
        }
        setSearchProducts(false);
      }, [searchProducts, farmerToSearch]);

      //use effect for setting expected amount for a selected product
      useEffect(() => {
        if (expectedQuantityForProduct.id !== -1) {
          API.setExpectedQuantityForProduct(expectedQuantityForProduct.id, expectedQuantityForProduct.quantity)
            .then(res => {
                setUpdatedQuantity(res);
            })
            .catch(e => handleErrors(e));
            setExpectedQuantityForProduct({id: -1, quantity : 0});
        } 
      }, [expectedQuantityForProduct]);

    return(
        <Container className="below-nav justify-content-center">
            <Row>
                <h1>Main page for the farmer {farmerName}</h1>
            </Row>
            <Row className ="my-3" align="center">
                <Col className="d-sm-block col-12 mb-3" sm= {4} id="farmer-sidebar">
                    <ListGroup variant = "flush">
                        <ListGroup.Item key = "label-insert-farmer" className = "border-bottom-0">
                            <h4>Search among you products</h4>
                            <p>You can find your products by putting your id, name or surname</p>
                        </ListGroup.Item>
                        <ListGroup.Item key = "form-searching-farmer-products">
                            <Form className = "mb-3">
                                <Form.Group controlId="farmer-searching" className = "mb-3">
                                    <Form.Control size = "lg"  value = {farmerToSearch} placeholder = "Insert id, name or surname"
                                    onChange={(event) => setFarmerToSearch(event.target.value)}/>       
                                </Form.Group>
                                <Button onClick={() => setSearchProducts(true)}>Search products</Button>
                            </Form>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                {searchProducts === true && <Alert variant='warning'>🕗Please wait while loading products...🕗</Alert>}
                {(trueIfNeverSearchedProducts === false && products.length === 0) &&
                    <Alert variant='danger'>Sorry, no products found for the specified farmer.</Alert>
                }
                { products.length !== 0 &&
                    <ProductList products = {products} setExpectedQuantityForProduct = {setExpectedQuantityForProduct} updatedQuantity = {updatedQuantity}
                    getCurrentTime = {props.getCurrentTime}/>
                }
                
            </Row>

        </Container>
    )
}

export function ProductList(props) {
    
    return (
        <Col>
            <ListGroup variant = "primary"> 
                {props.products.length &&
                    <>
                    <ListGroup.Item id="farmer-products-title" key = "farmer-products-title" variant = "primary">
                        <h5 className="text-left">Here is your product list</h5>
                    </ListGroup.Item>
                    {
                        props.products.map(product => {
                        return (
                            <ListGroup.Item id = {product.id} key = {product.id}>
                                <h5>{product.name}</h5>
                                <Row>
                                <Col sm = {4} md = {6}>
                                    <Row>Product id: {product.id} </Row>
                                    <Row>Product price: {product.price} </Row>
                                </Col>
                                <Col sm = {4} md = {6}>
                                    <ProductForm id = {product.id} updatedQuantity = {props.updatedQuantity}
                                    setExpectedQuantityForProduct = {props.setExpectedQuantityForProduct}
                                    getCurrentTime = {props.getCurrentTime}/>
                                </Col>
                                </Row>
                            </ListGroup.Item>    
                        ); 
                        })
                    }
                    </> 
                }     
            </ListGroup> 
        </Col>
    )
}

export function ProductForm(props){
    const [amount, setAmount] = useState(0);
    const [error, setError] = useState("");
    const [show, setShow] = useState(true);
    const [showWarning, setShowWarning] = useState(false);
    

    //need to check if it's possible to set amount
    //amounts of products can be set only between Monday after 9 and Saturday at 9:00
    //amounts cannot be set on Sundays
    let invalidTime = false;
    const currentTime = dayjs(props.getCurrentTime()); //building the dayjs obj
    if(currentTime.day() === 0 || (currentTime.day() === 1 && currentTime.hour() < 9) || (currentTime.day() === 6 && currentTime.hour() > 8)){
        invalidTime = true;
        //"Sorry, amounts cannot be set between Saturday at 9 and Monday at 9.");
    }
    

    function handleSetAmount(id, quantity) {
        if(quantity > -1){
            props.setExpectedQuantityForProduct({id: id, quantity: quantity});
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
            <Alert variant = "warning">Sorry, expected availabilities cannot be set between Saturday at 9 and Monday at 9. </Alert>
        :
            <Form>
                <Form.Group controlId= {`amountOf${props.id}`} className = "mb-3">
                    <Form.Control size = "sm" type="number" placeholder="Insert here the expected amount" value = {amount} onChange={(event) => setAmount(event.target.value)}/>       
                </Form.Group>
                {(error!=="" && showWarning) &&
                    <Alert variant='warning'>
                        <Row>
                        <Col>{error}</Col>
                        <Col lg={1}><Button variant="outline-warning" className = "p-0" onClick={() => setShowWarning(false)}>{littleX}</Button></Col>
                        </Row>
                    </Alert>
                }
                { (props.updatedQuantity.product === props.id && show) &&
                    <Alert variant = 'success'>
                        <Row>
                        <Col>Availability of product {props.id} updated successfully. New availability: {props.updatedQuantity.quantity}</Col>
                        <Col lg={1}><Button variant="outline-success" className = "p-0" onClick={() => setShow(false)}>{littleX}</Button></Col>
                        </Row>
                    </Alert>
                }
                <Button onClick={() => handleSetAmount(props.id, amount)}>Set expected amount</Button>
            </Form>
        }
        </>
    );
}
export default Farmer;