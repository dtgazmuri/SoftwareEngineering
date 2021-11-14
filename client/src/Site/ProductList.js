import Button from "@restart/ui/esm/Button";
import { useEffect, useState } from "react";
import { Form, InputGroup, Table } from "react-bootstrap";

import API from "../API";

/*

function CustomerSelection(customers, handleCustomer) {
    return (
        <>
            <Form>
                <Form.Select aria-label="Please select a client" onChange={ev => handleCustomer(ev.target.value)}>
                    <option>Open this select menu</option>
                    {customers.map((c) => {
                        return c.name + " " + c.surname;
                    })
                    }
                </Form.Select>
            </Form>


        </>
    )

}
*/

function ProductList(props) {
    const [customer, setCustomer] = useState();
    const [customerlist, setList] = useState([]);
    const [products, setProducts] = useState([]);

    //PRODUCTS FETCH
    useEffect(() => {
    const getProducts = async () => {
      try {
        const products = await API.fetchAllProducts();
        console.log(products);
        setProducts(products);
      } catch (err) {
        //setLogged(false)
        console.log(err.error);
      }
    };
    getProducts();
    }, []);

    useEffect(() =>{
        const getCustomers = async () => {
        try {
            const customers = await API.fetchAllCustomers();
            console.log(customers);
            setList(customers);
        } catch (err) {
            console.log(err.error);
        }
    };
        getCustomers();
    }, []);

    const handleCustomer = (c) => {
        setCustomer(c);
    }

    const handleSubmit = async (order) =>{
        try {
            const res = await API.postOrderByEmployee();
        } catch (err) {
            console.log(err.error);
        }
    }
    //const selection = CustomerSelection(customerlist, handleCustomer);
    const addbutton = <Button onClick={{/*add product to the cart*/ }}>+</Button>
    const productlist = products.map((prod, id) => {
        return <tr>
            <td>{prod.id}</td>
            <td>{prod.name}</td>
            <td>{prod.farmer.name + " " + prod.farmer.surname}</td>
            <td>{prod.price}</td>
            <td>{prod.quantity}</td>
            <td>{addbutton}</td>
        </tr>
    });

    return (
        <>

            {customer}
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
                <SubmitOrder handleSubmit={handleSubmit}/>
            </Table>
        </>
    )

}

function SubmitOrder(props){
    return(

        <>
        <Button variant="success" onClick={props.handleSubmit}>
                Submit Order!
        </Button>
        </>
    )



}
export default ProductList;