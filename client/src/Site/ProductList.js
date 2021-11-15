import { useEffect, useState } from "react";
import { Form, Button, Table } from "react-bootstrap";
import API from "../API";


function ProductList(props) {
    const [customer, setCustomer] = useState({id:"", name:"", surname:"", wallet:""});
    const [customerlist, setList] = useState([]);
    const [products, setProducts] = useState([]);
    const [delivery, setDelivery] = useState(false);
    const [address, setAddress] = useState("");
    const [order, setOrder] = useState([])

    useEffect(()=>{}
    , [customer])
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
        setCustomer({id:cust.id, name:cust.name,surname:cust.surname, wallet:cust.wallet})
    }

    const handleDelivery = () => setDelivery(true);

    const addOrder = (prod) => {
        //controllo se il prodotto è presente
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
        props.setMessage({type:"success", msg:`Product ${prod.name} added correctly`})

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
            props.setMessage({type:"success", msg:`Order added correctly`})

        } catch (err) {
            console.log(err.error);
            props.setMessage({type:"danger", msg:`Error on processing the order, try again`})

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

            {customer.name==="" ?
                <CustomerSelection customers={customerlist} handleCustomer={handleCustomer} />
                :
                <>
                    <p>{"Create a order for " + customer.name}</p>
                    <Table responsive className="table-prod">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Product Name</th>
                                <th>Farmer</th>
                                <th>Expected Quantity</th>
                                <th>Price</th>
                                <th>Add to the cart</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productlist}
                        </tbody>
                    </Table>
                        
                            <Form.Group controlId="delivery"> Do you want the order delivered at your home?
                                <Form.Control
                                    type="checkbox"
                                    label="Delivery at home?"
                                    onChange={handleDelivery}
                                />
                            </Form.Group>
                            {delivery ?
                                <Form.Group className="mb-3" controlId="delivery">
                                    <Form.Label>Please insert your delivery address</Form.Label>
                                    <Form.Control type="address" placeholder="Enter Address" onChange={ev => setAddress(ev.target.value)} />
                                </Form.Group>
                                : ""}
                        
                    <Button variant="success" onClick={handleSubmit}>
                        Submit Order!</Button>
                </>
            }
        </>
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
            <Form.Control as="select" aria-label="Please select a client" defaultValue="-- select an option --" onChange={ev => props.handleCustomer(ev.target.value)}>
                
                {customerlist}

            </Form.Control>


        </Form>
    )

}


export default ProductList;