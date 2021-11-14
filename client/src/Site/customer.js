import { Form, Button, Alert, Container, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import ProductList from "./ProductList";
import API from "../API";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function CustomerHome(props) {
    const [customer, setCustomer] = useState();

    useEffect(() =>{
        const getCustomer = async (id) => {
        try {
            const customer = await API.fetchCustomerById(id);
            setCustomer(customer);
        } catch (err) {
            console.log(err.error);
        }
    };
        getCustomer(props.user.id);
    }, [props.user.id]);

    return (
        <>
            <Row>
                <h1> Benvenuto, {customer.name} </h1>
            </Row>
            <Row>
                <h3>Amout on your wallet: {customer.wallet} €</h3>
                <Button onClick={<Navigate replace to="/customer/:id/basket"/>}>Kart</Button>
            </Row>
            <ProductList/>
        </>
    )
}


export {CustomerHome};