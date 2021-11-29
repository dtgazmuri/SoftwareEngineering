import dayjs from 'dayjs';
import { React, useState, useEffect } from 'react';
import { Col, Container, Row, ListGroup, Form, Button, Alert } from "react-bootstrap";
import API from '../FarmerAPI'


function Farmer(props) {
    const farmerName = "Farmer1";
    const [trueIfNeverSearchedProducts, setTrueIfNeverSearchedProducts] = useState(true);
    const [farmerId, setFarmerId] = useState(0);
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
        
          API.getProductsOfFarmer(farmerId)
            .then(farmer_products => {
                setProducts(farmer_products);
            })
            .catch(e => handleErrors(e));
        }
        setSearchProducts(false);
      }, [searchProducts, farmerId]);

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
                <Col className="d-sm-block col-12" sm= {4} id="farmer-sidebar">
                    <Form className = "mb-3">
                        <Form.Group controlId="farmer-id" className = "mb-3">
                            <Form.Label>Insert here your farmer id</Form.Label>
                            <Form.Control size = "lg" type="number" min = "0" value = {farmerId} onChange={(event) => setFarmerId(event.target.value)}/>       
                        </Form.Group>
                        <Button onClick={() => setSearchProducts(true)}>Search products</Button>
                    </Form>
                </Col>
                {searchProducts === true && <Alert variant='warning'>🕗Please wait while loading products...🕗</Alert>}
                {(trueIfNeverSearchedProducts === false && products.length === 0) &&
                    <Alert variant='danger'>Sorry, no products found for the specified farmer id.</Alert>
                }
                { products.length !== 0 &&
                    <ProductList products = {products} setExpectedQuantityForProduct = {setExpectedQuantityForProduct} updatedQuantity = {updatedQuantity}
                    getCurrentTime = {props.getCurrentTime}/>
                }
                
            </Row>

        </Container>
    )
}

function ProductList(props) {
    
    return (
        <Col>
            <ListGroup variant = "primary"> 
                {props.products.length &&
                    props.products.map(product => {
                        return (
                            <ListGroup.Item id = {product.id} key = {product.id}>
                                <h5>{product.name}</h5>
                                <Row>
                                <Col>
                                    <Row>Product id: {product.id} </Row>
                                    <Row>Product price: {product.price} </Row>
                                </Col>
                                <Col>
                                    <ProductForm id = {product.id} updatedQuantity = {props.updatedQuantity}
                                    setExpectedQuantityForProduct = {props.setExpectedQuantityForProduct}
                                    getCurrentTime = {props.getCurrentTime}/>
                                </Col>
                                </Row>
                            </ListGroup.Item>    
                        ); 
                    })
                }     
            </ListGroup> 
        </Col>
    )
}

function ProductForm(props){
    const [amount, setAmount] = useState(0);
    const [error, setError] = useState("");
    function handleSetAmount(id, quantity) {
        //need to check if it's possible to set amount
        //amounts of products can be set only between Monday after 9 and Saturday at 9:00
        //amounts cannot be set on Sundays
        const currentTime = dayjs(props.getCurrentTime()); //building the dayjs obj
        if(currentTime.day() === 0 || (currentTime.day() === 1 && currentTime.hour() < 9) || (currentTime.day() === 6 && currentTime.hour() > 8)){
            setError("Sorry, amounts cannot be set between Saturday at 9 and Monday at 9.");
            return;
        }
        if(quantity > -1){
            props.setExpectedQuantityForProduct({id: id, quantity: quantity});
            setError("");
        }
        else
            setError("Impossible to set a negative/undefined amount. If you think you won't have this product next week, set 0");
    }
    return (
        <Form>
            <Form.Group controlId= {`amountOf${props.id}`} className = "mb-3">
                <Form.Control size = "sm" type="number" placeholder="Insert here the expected amount" value = {amount} onChange={(event) => setAmount(event.target.value)}/>       
            </Form.Group>
            {error!=="" && 
                <Alert variant='warning'>{error}</Alert>
            }
            {props.updatedQuantity.product === props.id && 
                <Alert variant = 'success'>Product {props.id} updated successfully. New availability: {props.updatedQuantity.quantity}</Alert>
            }
            <Button onClick={() => handleSetAmount(props.id, amount)}>Set expected amount</Button>
        </Form>
    );
}
export default Farmer;