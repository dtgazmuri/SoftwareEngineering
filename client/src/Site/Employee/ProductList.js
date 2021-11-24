import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Form, Button, Table, Modal, Row, Col, Container, Card } from "react-bootstrap";
import API from "../../API";

import '../../App.css';

import CustomerSelection from "./CustomerSelection.js"

/*
function ProductListEmployee(props) {
    const [customer, setCustomer] = useState({ id: "", name: "", surname: "", wallet: "" }); //<- 
    const [customerlist, setList] = useState([]);

    const [products, setProducts] = useState([]); //list of available products

    const [delivery, setDelivery] = useState(false);
    const [address, setAddress] = useState("");
    const [order, setOrder] = useState([]) //order<-
    const [show, setShow] = useState(false)
    const [date, setDate] = useState();
    const [time, setTime] = useState();

    const handleClose = () => {
        setShow(false)
    }

    const handleShow = () => {
        setShow(true)
    }

    useEffect(() => {
        // Niente
    }
        , [delivery, customer])

    
    //PRODUCTS FETCH
    useEffect(() => {
        const getProducts = async () => {
            try {
                const current_products = await API.fetchAllProducts();
                setProducts(current_products);
            } catch (err) {
                //setLogged(false)
                console.log(err.error);
            }
        };
        getProducts();
    }, []);


    //CUSTOMERS FETCH
    useEffect(() => {
        const getCustomers = async () => {
            try {
                const customers = await API.fetchAllCustomers();
                setList(customers);
            } catch (err) {
                console.log(err.error);
            }
        };
        getCustomers();
    }, []);


    //SET CUSTOMER
    const handleCustomer = async (c) => {

        const cust = customerlist.filter((cst) => {
            // eslint-disable-next-line eqeqeq
            if (c == cst.id)
                return true
            else return false
        })[0]
        setCustomer({ id: cust.id, name: cust.name, surname: cust.surname, wallet: cust.wallet })
    }
    

    //SET DELIVERY BOOL
    const handleDelivery = (() => {
        if (delivery) {
            setDelivery(false);
        }
        else {
            setDelivery(true);
        }
    });

    const addOrder = (prod) => {
        //check if product is already present (+1) or absent (1)
        if (order.some(o => o.id === prod.id)) {
            const neworder = order.map(o => {
                if (o.id === prod.id)
                    return { id: prod.id, name: prod.name, price: prod.price, quantity: o.quantity + 1 }
                else
                    return o;
            })
            setOrder(neworder)


        }
        else
            setOrder([...order, { id: prod.id, name: prod.name, price: prod.price, quantity: 1 }])
        props.setMessage({ type: "success", msg: `Product ${prod.name} added correctly` })

    }

    const removeOrder = (prod) => {
        if (order.some(o => o.id === prod.id)) {
            const neworder = order.map(o => {
                if (o.id === prod.id && o.quantity >= 1)
                    return { id: prod.id, name: prod.name, price: prod.price, quantity: o.quantity - 1 }
                else
                    return o;
            })
            setOrder(neworder)

        }
    }

    const handleSubmit = async () => {

        let total = 0;
        let deladd = "shop"
        if (delivery)
            deladd = address;

        let customerid = customer.id;
        for (let o of order) {
            total += o.price * o.quantity;
        }
        try {
            await API.postOrderByEmployee({ customerid: customerid, state: "pending", delivery: deladd, total: total, listitems: order });
            props.setMessage({ type: "success", msg: `Order added correctly` })

        } catch (err) {
            console.log(err.error);
            props.setMessage({ type: "danger", msg: `Error on processing the order, try again` })

        }
    }

    const getBookedProduct = ((prod_id) => {
        for (let i = 0; i < order.length; i++) {
            if (order[i].id == prod_id) {
                return order[i].quantity;
            }
        }

        return 0;
    });

    const productlist = products.map((prod, id) => {

        if (getBookedProduct(prod.id) > 0) {
            return <tr data-testid={`product-item-${id}`} key={"prod" + id} bgcolor="#99ff99">
                <td>{prod.id}</td>
                <td>{prod.name}</td>
                <td>{prod.farmer.name + " " + prod.farmer.surname}</td>
                <td>{prod.price} €/kg</td>
                <td>{prod.quantity} kg</td>
                <td><Button onClick={() => addOrder(prod)}>+</Button></td>
                <td><Button onClick={() => removeOrder(prod)}>-</Button></td>
                <td>{getBookedProduct(prod.id)}</td>

            </tr>
        }
        else {

            return <tr data-testid={`product-item-${id}`} key={"prod" + id}>
                <td>{prod.id}</td>
                <td>{prod.name}</td>
                <td>{prod.farmer.name + " " + prod.farmer.surname}</td>
                <td>{prod.price} €/kg</td>
                <td>{prod.quantity} kg</td>
                <td><Button onClick={() => addOrder(prod)}>+</Button></td>
                <td><Button onClick={() => removeOrder(prod)}>-</Button></td>
                <td>{getBookedProduct(prod.id)}</td>

            </tr>
        }
    });

    const checkTime = () => {
        let day = dayjs(props.time).get("d");
        let hour = dayjs(props.time).get("h");
        console.log(day, hour)
        if (day !== 0 || (hour < 23 && day === 0))
            return true
        else
            return false;
    }

    return (
        <>
            {checkTime() ?
                customer.name === "" ?
                    <CustomerSelection customers={customerlist} handleCustomer={handleCustomer} />
                    :
                    <>
                        <h3>{"Create a order for " + customer.name + " " + customer.surname}</h3>
                        <Table responsive className="table-prod">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Product Name</th>
                                    <th>Farmer</th>
                                    <th>Price</th>
                                    <th>Expected Quantity</th>
                                    <th>Add to the cart</th>
                                    <th>Remove from the cart</th>
                                    <th>Booked quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productlist}
                                <tr key="delivery-row">

                                    <td as={Col}>
                                        <tr>
                                            <th>
                                                Do you want the order to be delivered at your home?

                                                <Form.Group controlId="delivery">
                                                    <Form.Control
                                                        type="checkbox"
                                                        label="delivery"
                                                        onChange={handleDelivery}
                                                        inline
                                                    />
                                                </Form.Group>
                                            </th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                        <tr>
                                            {delivery ?
                                                <>
                                                    <td>
                                                        <Form.Group className="mb-3" controlId="delivery">
                                                            <Form.Label>Please insert your delivery address</Form.Label>
                                                            <Form.Control type="address" placeholder="Enter Address" onChange={ev => setAddress(ev.target.value)} />
                                                        </Form.Group>
                                                    </td>
                                                    <td></td><td></td><td></td><td></td><td></td><td></td>
                                                </>
                                                : <></>
                                            }
                                        </tr>
                                    </td>
                                    <td as={Col}> </td><td as={Col}> </td><td as={Col}> </td>
                                    <td as={Col}>
                                        <Form.Group controlId="form-date">
                                            <Form.Label>Date</Form.Label>
                                            <Form.Control type="date" className="mb-3" name="date" format="dd/MM/yyyy" value={date} onChange={(ev) => setDate(ev.target.value)} />
                                        </Form.Group>
                                        <Form.Group controlId="form-deadline-time">
                                            <Form.Label>Time</Form.Label>
                                            <Form.Control type="time" name="time" value={time} onChange={(ev) => setTime(ev.target.value)} />
                                        </Form.Group>

                                    </td>
                                    <td as={Col}> </td><td as={Col}> </td><td as={Col}> </td>
                                </tr>

                                <tr id="submrow">
                                    <th>
                                        <Button variant="success" onClick={handleShow}>Submit Order!</Button>
                                    </th>
                                </tr>
                            </tbody>
                        </Table>
                        <RecapCart order={order} handleClose={handleClose} show={show} handleSubmit={handleSubmit} address={address} delivery={delivery} date={date} time={time} />

                    </>
                : <h1>We're sorry but orders close at 23 of every Sunday</h1>
            }
        </>
    )

}
*/


function ProductListEmployee(props) {
    const [customer, setCustomer] = useState({ id: "", name: "", surname: "", wallet: "" }); //<- 
    const [customerlist, setList] = useState([]);

    const [products, setProducts] = useState([]); //list of available products

    const [delivery, setDelivery] = useState(false);
    const [address, setAddress] = useState("");

    const [order, setOrder] = useState([]) //List of all ordererd products

    const [show, setShow] = useState(false)
    const [date, setDate] = useState();
    const [time, setTime] = useState();


    //Error in cart
    const [cartError, setCartError] = useState(false);
    const [cartErrorMessage, setCartErrorMessage] = useState("");

    //Close the order confirmed modal
    const handleClose = () => {
        setShow(false);
    }

    //Open the order confirmed modal OR the error modal is some fields are undefined!
    const handleShow = () => {

        let good = true;
        setCartError(false);
        setCartErrorMessage("");

        if (order.length <= 0 && good) {
            setCartError(true);
            setCartErrorMessage("Your cart is empty!");
            good = false;
        }

        if (date === undefined && good) {
            setCartError(true);
            setCartErrorMessage("You didn't set the withdraw date!");
            good = false;
        }


        if (time === undefined && good) {
            setCartError(true);
            setCartErrorMessage("You didn't set the withdraw time!");
            good = false;
        }


        setShow(true);
    }

    //PRODUCTS FETCH
    useEffect(() => {
        const getProducts = async () => {
            try {
                const current_products = await API.fetchAllProducts();
                setProducts(current_products);
            } catch (err) {
                //setLogged(false)
                console.log(err.error);
            }
        };
        getProducts();
    }, []);


    //CUSTOMERS FETCH
    useEffect(() => {
        const getCustomers = async () => {
            try {
                const customers = await API.fetchAllCustomers();
                setList(customers);
            } catch (err) {
                console.log(err.error);
            }
        };
        getCustomers();
    }, []);


    //SET CUSTOMER
    const handleCustomer = async (c) => {

        const cust = customerlist.filter((cst) => {
            // eslint-disable-next-line eqeqeq
            if (c == cst.id)
                return true
            else return false
        })[0]
        setCustomer({ id: cust.id, name: cust.name, surname: cust.surname, wallet: cust.wallet })
    }


    //SET DELIVERY BOOL
    const handleDelivery = (() => {
        if (delivery) {
            setDelivery(false);
        }
        else {
            setDelivery(true);
        }
    });

    const addOrder = (prod) => {
        //check if product is already present (+1) or absent (1)
        if (order.some(o => o.id === prod.id)) {
            const neworder = order.map(o => {
                if (o.id === prod.id) {
                    return { id: prod.id, name: prod.name, price: prod.price, quantity: o.quantity + 1 };
                }
                else {
                    return o;
                }
            });
            setOrder(neworder);
        }
        else {
            setOrder([...order, { id: prod.id, name: prod.name, price: prod.price, quantity: 1 }]);
            //props.setMessage({ type: "success", msg: `Product ${prod.name} added correctly` });
        }

    }

    const removeOrder = (prod) => {

        if (order.some(o => o.id === prod.id)) {

            let neworder;
            let newQta = 0;

            neworder = order.map(o => {
                if (o.id === prod.id && o.quantity >= 1) {
                    newQta = o.quantity - 1;
                    return { id: prod.id, name: prod.name, price: prod.price, quantity: o.quantity - 1 }
                }
                else {
                    return o;
                }
            });

            if (newQta <= 0) {
                //Cancel it from the array
                neworder = order.filter(o => {
                    if (o.id == prod.id) {
                        return false;
                    }
                    else {
                        return true;
                    }
                });
            }

            setOrder(neworder);
        }
    }

    const handleSubmit = async () => {

        let total = 0;
        let deladd = "shop"
        if (delivery)
            deladd = address;

        let customerid = customer.id;
        for (let o of order) {
            total += o.price * o.quantity;
        }
        try {
            await API.postOrderByEmployee({ customerid: customerid, state: "pending", delivery: deladd, total: total, listitems: order });
            props.setMessage({ type: "success", msg: `Order added correctly` })

        } catch (err) {
            console.log(err.error);
            props.setMessage({ type: "danger", msg: `Error on processing the order, try again` })
        }

        //Close modal
        setShow(false);
    }

    const getBookedProduct = ((prod_id) => {
        for (let i = 0; i < order.length; i++) {
            if (order[i].id == prod_id) {
                return order[i].quantity;
            }
        }

        return 0;
    });

    const checkTime = () => {
        let day = dayjs(props.time).get("d");
        let hour = dayjs(props.time).get("h");
        console.log(day, hour)
        if (day !== 0 || (hour < 23 && day === 0))
            return true
        else
            return false;
    }

    return (
        <>
            {
                checkTime() ?
                    <>
                        <Container fluid>
                            {
                                customer.name === "" ?
                                    <>
                                        <CustomerSelection customers={customerlist} handleCustomer={handleCustomer} />
                                    </>
                                    :
                                    <>
                                        {/* MODAL FOR ORDER CONFIRMATION */}

                                        {
                                            cartError ?
                                                <ErrorCartModal handleClose={handleClose} show={show} errorMessage={cartErrorMessage} />
                                                :
                                                <RecapCart order={order} handleClose={handleClose} show={show} handleSubmit={handleSubmit} address={address} delivery={delivery} date={date} time={time} />
                                        }



                                        {/* PRODUCT TABLE */}
                                        <ProductTable productList={products} getBookedProduct={getBookedProduct} addOrder={addOrder} removeOrder={removeOrder}></ProductTable>

                                        {/* FOOTER TO SET THE DELIVERY DATE/TIME/ADDRESS */}
                                        <ConfirmDeliveryPanel handleDelivery={handleDelivery} address={address} setAddress={setAddress} delivery={delivery} date={date} time={time} setTime={setTime} setDate={setDate} handleShow={handleShow}></ConfirmDeliveryPanel>
                                    </>
                            }
                        </Container>
                    </>
                    :
                    <>
                        <Container fluid>
                            <h1>
                                Sorry the service is unavailable now!
                            </h1>
                        </Container>
                    </>
            }
        </>
    )

}



//Create the confirm delivery panel
function ConfirmDeliveryPanel(props) {
    return (
        <Container fluid>
            <Card>
                <Card.Body>
                    <Card.Title>Order Confirmation</Card.Title>
                    <div class="h-divider" />
                    <Card.Text>
                        <Form.Group controlId="form-date">
                            <Form.Label>Date</Form.Label>
                            <Form.Control type="date" className="mb-3" name="date" format="dd/MM/yyyy" value={props.date} onChange={(ev) => props.setDate(ev.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="form-deadline-time">
                            <Form.Label>Time</Form.Label>
                            <Form.Control type="time" name="time" value={props.time} onChange={(ev) => props.setTime(ev.target.value)} />
                        </Form.Group>
                    </Card.Text>
                    <br />
                    <Card.Text>
                        <Form.Group controlId="delivery">
                            <Form.Check
                                type="checkbox"
                                label="Delivery at home?"
                                onChange={() => props.handleDelivery()}
                                inline
                            />
                        </Form.Group>

                        {
                            props.delivery ?
                                <Form.Group className="mb-3" controlId="delivery">
                                    <Form.Control type="address" placeholder="Enter Address" value={props.address} onChange={ev => props.setAddress(ev.target.value)} />
                                </Form.Group>
                                :
                                <></>
                        }

                    </Card.Text>
                    <div class="h-divider" />
                    <br />
                    <Button variant="primary" onClick={() => props.handleShow()}>Confirm Order</Button>

                </Card.Body>
            </Card>
        </Container>
    );
}


//Create the table
function ProductTable(props) {

    const list = props.productList.map((prod, id) => {
        return <ProductTableRow productData={prod} productIndex={id} addOrder={props.addOrder} removeOrder={props.removeOrder} getBookedProduct={props.getBookedProduct} />;
    });

    return (
        <Table responsive className="table-prod">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Farmer</th>
                    <th>Price/Package</th>
                    <th>Qta/Package</th>
                    <th>Add to cart</th>
                    <th>Remove from cart</th>
                    <th>Booked quantity</th>
                </tr>
            </thead>
            <tbody>
                {list}
            </tbody>
        </Table>
    );
}

//Create the table row
function ProductTableRow(props) {

    const prod = props.productData;
    const id = props.productIndex;

    const bookedQTA = props.getBookedProduct(prod.id);

    return (

        <>
            {
                bookedQTA > 0 ?
                    <tr data-testid={`product-item-${id}`} key={"prod" + id} bgcolor="#99ff99">
                        <td>{prod.name}</td>
                        <td>{prod.farmer.name + " " + prod.farmer.surname}</td>
                        <td>{prod.price} €</td>
                        <td>{prod.quantity} g</td>
                        <td><Button onClick={() => props.addOrder(prod)}>+</Button></td>
                        <td><Button onClick={() => props.removeOrder(prod)}>-</Button></td>
                        <td>{bookedQTA === 0 ? '-' : bookedQTA}</td>
                    </tr>
                    :
                    <tr data-testid={`product-item-${id}`} key={"prod" + id}>
                        <td>{prod.name}</td>
                        <td>{prod.farmer.name + " " + prod.farmer.surname}</td>
                        <td>{prod.price} €</td>
                        <td>{prod.quantity} g</td>
                        <td><Button onClick={() => props.addOrder(prod)}>+</Button></td>
                        <td><Button onClick={() => props.removeOrder(prod)}>-</Button></td>
                        <td>{bookedQTA === 0 ? '-' : bookedQTA}</td>
                    </tr>
            }
        </>
    );

}



function ErrorCartModal(props) {
    return (
        <Modal show={props.show}>
            <Modal.Header closeButton={props.handleClose}>
                <Modal.Title>Error</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div>
                    {props.errorMessage}
                </div>
                <div>
                    <Button variant='secondary' onClick={props.handleClose}>Ok</Button>
                </div>
            </Modal.Body>



        </Modal>
    );
}


function RecapCart(props) {

    let total = 0
    let total_weight = 0;
    for (let o of props.order) {
        total += o.price * o.quantity;
        total_weight += o.quantity;
    }
    const cartlist = props.order.map((item) => {
        return (
            <>
                <tr id={item.id}>
                    <th>{item.name}</th>
                    <th>{item.quantity}</th>
                    <th>{(item.price * item.quantity).toFixed(2)} €</th>
                </tr>
            </>
        );
    })


    return (
        <Modal show={props.show} >
            <Modal.Header closeButton={props.handleClose}>
                <Modal.Title>Order Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>Your Products</h5>
                <Table>
                    <thead>
                        <tr id="header">
                            <th>NAME</th>
                            <th>QTA</th>
                            <th>€</th>
                        </tr>
                    </thead>

                    <tbody>
                        {cartlist}
                    </tbody>

                    <tfoot>

                        <tr>
                            <td>
                                <b>Total:</b>
                            </td>

                            <td>
                                {
                                    total_weight
                                }
                            </td>

                            <td>
                                {
                                    total.toFixed(2)
                                }
                                &nbsp;€
                            </td>
                        </tr>

                    </tfoot>

                </Table>

                <h5>Delivery Details</h5>
                <Table>
                    <tbody>
                        <tr>
                            <td>
                                <b>Delivery Address:</b>
                            </td>
                            <td colSpan="2">
                                {
                                    props.delivery ? props.address : "Pick-up at the shop"
                                }
                            </td>
                        </tr>

                        <tr>
                            <td><b>Delivery date:</b></td>
                            <td colSpan="2">{`${props.date} at ${props.time}`}</td>
                        </tr>

                    </tbody>
                </Table>

                <Button onClick={props.handleSubmit}>Save</Button>
                &nbsp;
                &nbsp;
                &nbsp;
                <Button variant='secondary' onClick={props.handleClose}>Cancel</Button>

            </Modal.Body>

        </Modal>
    )
}









/*
function CustomerSelection(props) {

    const [customerName, setCustomerName] = useState("");
    const [customerlist, setCustomerList] = useState();

    //use effect to fill customerList at the beginning
    useEffect(() => {
        let newCustomerlist = props.customers.map((e, id) => {
            return <option key={`customer-${id}`} value={e.id}>  {e.name + " " + e.surname}  </option>}
        );
        setCustomerList(newCustomerlist);
    }, [props.customers.length]);

    //this function takes the input inside the searchbar and filters all the customers according to the value written
    //in order to simplify the search, it is case insensitive.
    const handleFilterCustomer = (newName) => {
        setCustomerName(newName);
        let newCustomerlist = props.customers.filter(customer => 
            (customer.name.toUpperCase().startsWith(newName.toUpperCase()) || customer.surname.toUpperCase().startsWith(newName.toUpperCase()) ) )
        .map((e, id) => {
            return <option key={`customer-${id}`} value={e.id}>  {e.name + " " + e.surname}  </option>
        }
        );
        setCustomerList(newCustomerlist);
    }

    return (
        <Form align-items="center">
        <Row>
            <Col sm = {4}>
                <Form.Label className="mb-0">Select a client for the order using the dropdown</Form.Label>
                <Form.Text className="text-muted">
                    You can filter by customer name.
                </Form.Text>
            </Col>
            <Col sm = {3}>
                <Form.Control  type="text" placeholder="Search customer by name" value = {customerName} onChange={(event) => handleFilterCustomer(event.target.value)}/>       
            </Col>
            <Col sm = {5}>
                <Form.Control as="select" aria-label="Please select a client" onChange={ev => props.handleCustomer(ev.target.value)}>
                    <option key={`customerdefault`} selected disabled hidden >---select---</option>
                    {customerlist}
                </Form.Control>
            </Col>
            
        </Row>
        </Form>
    )

}
*/


export default ProductListEmployee;