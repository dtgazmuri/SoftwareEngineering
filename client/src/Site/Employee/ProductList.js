import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Form, Button, Table, Modal, Row, Col } from "react-bootstrap";
import API from "../../API";

function ProductListEmployee(props) {
    const [customer, setCustomer] = useState({ id: "", name: "", surname: "", wallet: "" }); //<- 
    const [customerlist, setList] = useState([]);
    const [products, setProducts] = useState([]); //list of available products
    const [delivery, setDelivery] = useState(false);
    const [address, setAddress] = useState("");
    const [order, setOrder] = useState([]) //order<-
    const [show, setShow] = useState(false)

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
        for (let i = 0; i < order.length; i++){
            if (order[i].id == prod_id){
                return order[i].quantity;
            }
        }

        return 0;
    });

    const productlist = products.map((prod, id) => {
        
        if (getBookedProduct(prod.id) > 0){
            return <tr key={"prod" + id} bgcolor="#99ff99">
            <td>{prod.id}</td>
            <td>{prod.name}</td>
            <td>{prod.farmer.name + " " + prod.farmer.surname}</td>
            <td>{prod.price}</td>
            <td>{prod.quantity}</td>
            <td><Button onClick={() => addOrder(prod)}>+</Button></td>
            <td><Button onClick={() => removeOrder(prod)}>-</Button></td>
            <td>{getBookedProduct(prod.id)}</td>

            </tr>
        }
        else{
        
            return <tr key={"prod" + id}>
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
        console.log(day, hour )
        if(day !== 0 || (hour<23&&day===0))
            return true
        else 
        return false;
    }

    return (
        <>
        {checkTime()?
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
                                <th>
                                    Do you want the order to be delivered at your home?
                                </th>
                                <th>
                                    <Form.Group controlId="delivery">
                                        <Form.Control
                                            type="checkbox"
                                            label="delivery"
                                            onChange={handleDelivery}
                                            inline
                                        />
                                    </Form.Group>
                                </th>
                                <th></th><th></th><th></th><th></th><th></th><th></th>
                            </tr>

                            {delivery ?
                                <tr>
                                    <td>
                                        <Form.Group className="mb-3" controlId="delivery">
                                            <Form.Label>Please insert your delivery address</Form.Label>
                                            <Form.Control type="address" placeholder="Enter Address" onChange={ev => setAddress(ev.target.value)} />
                                        </Form.Group>
                                    </td>
                                    <td></td><td></td><td></td><td></td><td></td><td></td>
                                </tr>

                                : <></>}

                            <tr id="submrow">
                                <th>
                                    <Button variant="success" onClick={handleShow}>Submit Order!</Button>
                                </th>
                            </tr>
                        </tbody>
                    </Table>
                    <RecapCart order={order} handleClose={handleClose} show={show} handleSubmit={handleSubmit} />

                </>
            :<h1>We're sorry but orders close at 23 of every Sunday</h1>
            }
        </>
    )

}


function RecapCart(props) {

    let total = 0
    for (let o of props.order) {
        total += o.price * o.quantity;
    }
    const cartlist = props.order.map((item) => {


        return <tr id={item.id}>
            <th>{item.id}</th>
            <th>{item.name}</th>
            <th>{item.quantity} kg</th>
            <th>{(item.price * item.quantity).toFixed(2)} €</th>
        </tr>
    })


    return (
        <Modal show={props.show}>
            <Modal.Header closeButton={props.handleClose}>
                <Modal.Title>Your cart</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.order.length == 0 ? <>
                    <Row id="empty">Your cart is empty!</Row>
                    <Button variant='secondary' onClick={props.handleClose}>Cancel</Button></>
                    :
                    <Table>
                        <thead>
                            <tr id="header">
                                <th>ID</th>
                                <th>NAME</th>
                                <th>QUANTITY</th>
                                <th>€</th>
                            </tr>
                        </thead>
                        {cartlist}
                        <tr id="total">
                            <th>
                                Your total: {total.toFixed(2)}€
                            </th>
                        </tr>
                        <tr id="buttons" className="buttonRow d-flex justify-content-around" >

                            <Button onClick={props.handleSubmit}>Save</Button>

                            <Button variant='secondary' onClick={props.handleClose}>Cancel</Button>

                        </tr>


                    </Table>
                }
            </Modal.Body>

        </Modal>
    )
}

function CustomerSelection(props) {

    const [customerName, setCustomerName] = useState("");
    const [customerlist, setCustomerList] = useState(
                props.customers.map((e, id) => {
                return <option key={`customer-${id}`} value={e.id}>  {e.name + " " + e.surname}  </option>}
    ));

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
                    You can first filter your research by putting his/her name.
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


export default ProductListEmployee;