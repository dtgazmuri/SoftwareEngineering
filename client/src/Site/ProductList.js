import { useEffect, useState } from "react";
import { Form, Button, Table, Modal, Row, Col } from "react-bootstrap";
import API from "../API";


function ProductList(props) {
    const [customer, setCustomer] = useState({ id: "", name: "", surname: "", wallet: "" });
    const [customerlist, setList] = useState([]);
    const [products, setProducts] = useState([]);
    const [delivery, setDelivery] = useState(false);
    const [address, setAddress] = useState("");
    const [order, setOrder] = useState([])
    const [show, setShow] = useState(false)

    const handleClose = () => {
        setShow(false)
    }


    const handleShow = () => {
        setShow(true)
    }

    useEffect(() => { }
        , [delivery,customer])
    //PRODUCTS FETCH
    useEffect(() => {
        const getProducts = async () => {
            try {
                const products = await API.fetchAllProducts();
                setProducts(products);
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
    const handleDelivery = () => setDelivery(true);

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
    /*
    const newItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      };
    */
    const handleSubmit = async () => {
        try {

            let total = 0;
            let deladd = "false"
            if (delivery)
                deladd = address;

            let customerid = customer.id;
            for (let o of order) {
                total += o.price * o.quantity;
            }
            await API.postOrderByEmployee({ customerid: customerid, state: "pending", delivery: deladd, total: total, listitems: order });
            props.setMessage({ type: "success", msg: `Order added correctly` })

        } catch (err) {
            console.log(err.error);
            props.setMessage({ type: "danger", msg: `Error on processing the order, try again` })

        }
    }

    const productlist = products.map((prod, id) => {
        return <tr key={"prod" + id}>
            <td>{prod.id}</td>
            <td>{prod.name}</td>
            <td>{prod.farmer.name + " " + prod.farmer.surname}</td>
            <td>{prod.price}</td>
            <td>{prod.quantity}</td>
            <td><Button onClick={() => addOrder(prod)}>+</Button></td>
        </tr>
    });

    return (
        <>

            {customer.name === "" ?
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
                            </tr>
                        </thead>
                        <tbody>
                            {productlist}
                            <tr key="delivery-row">
                                <th>
                                    <Form.Group controlId="delivery"> Do you want the order to be delivered at your home?
                                        <Form.Control
                                            type="checkbox"
                                            label="delivery"
                                            onChange={handleDelivery}
                                        />
                                    </Form.Group>
                                    {delivery ?
                                        <Form.Group className="mb-3" controlId="delivery">
                                            <Form.Label>Please insert your delivery address</Form.Label>
                                            <Form.Control type="address" placeholder="Enter Address" onChange={ev => setAddress(ev.target.value)} />
                                        </Form.Group>
                                        : ""}
                                </th>
                            </tr>
                            <tr id="submrow">
                                <th>
                                    <Button variant="success" onClick={handleShow}>Submit Order!</Button>
                                </th>
                            </tr>
                        </tbody>
                    </Table>
                    <RecapCart order={order} handleClose={handleClose} show={show} handleSubmit={handleSubmit} />

                </>
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
            <th>{item.quantity}</th>
            <th>{item.price * item.quantity} €</th>
        </tr>
    })


    return (
        <Modal show={props.show}>
            <Modal.Header closeButton={props.handleClose}>
                <Modal.Title>Your cart</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.order.length == 0 ?<>
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
                                Your total: {total}€
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

    const customerlist = props.customers.map((e, id) => {
        return <option key={`customer-${id}`} value={e.id}>  {e.name + " " + e.surname}  </option>
    }
    );

    return (
        <Form align-items="center">
            <Form.Label>Please select a client for the order:</Form.Label>
            <Form.Control as="select" aria-label="Please select a client" value="-- select an option --" onChange={ev => props.handleCustomer(ev.target.value)}>

                {customerlist}

            </Form.Control>


        </Form>
    )

}


export default ProductList;