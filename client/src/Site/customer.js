import { Form, Button, Alert, Container, Row, Col } from "react-bootstrap";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {ProductList} from "./ProductList";
import API from "../API";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function CustomerHome() {



    return (
        <>
            <Row>
                
            </Row>
            <ProductList/>
        </>
    )
}


export {CustomerHome};