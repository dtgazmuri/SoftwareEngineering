import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Container, Row, Col, ListGroup, Alert, Button, Form, Modal, Table } from "react-bootstrap";
import { Link } from 'react-router-dom';

import { deliverybig, alarm, managerreport } from '../icons';

//API
import API from '../../ManagerAPI'



function ManagerPage(props) {

    return (
        <>
            <Container fluid className="below-nav vh-100 align-items-center">
                <Row id="managerFunctions">

                    <SeeFarmerOrdersButton />

                    <SeeReportsButton />


                </Row>
            </Container>
        </>
    )
}

function SeeFarmerOrdersButton() {
    //this is a button shown in the mainpage of the manager that redirects to /manager/farmerOrders
    return (
        <Col id="ackFarmerOrder">
            <Link to="/manager/farmerorders">
                <Container id="del-button" fluid className="LoginButton border border-dark rounded nolink mb-3" align="center" >
                    {deliverybig}
                    <h3>See Farmer Orders</h3>
                </Container>
            </Link>
        </Col>
    )
}

function SeeReportsButton() {
    //this is a button shown in the mainpage of the manager that redirects to /manager/farmerOrders
    return (
        <Col id="ackFarmerOrder">
            <Link to="/manager/reports">
                <Container id="del-button" fluid className="LoginButton border border-dark rounded nolink mb-3" align="center" >
                    {managerreport}
                    <br></br><br></br>
                    <h3>See Reports</h3>
                </Container>
            </Link>
        </Col>
    )
}

function ManagerPageFarmerOrders(props) {
    const [orders, setOrders] = useState([]);
    const [ordersToShow, setOrdersToShow] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orderToSearch, setOrderToSearch] = useState("");


    //orders from farmer are delivered from Monday 9:00 (after confirmation) to Tuesday evening (let's say 21:00)
    let validTime = false;
    const currentTime = dayjs(props.getCurrentTime()); //building the dayjs obj

    if (currentTime.day() === 1 && currentTime.hour() > 8) //if it's Monday after 8.59, can set ack
        validTime = true;
    if (currentTime.day() === 2 && currentTime.hour() < 21) //if it's Tuesday before 21, can set ack for delivery
        validTime = true;

    //use effect that when we type something in the searchbar, triggers the filtering
    useEffect(() => {
        const value = orderToSearch;
        if (value === "") {
            setOrdersToShow(orders);
            return;
        }
        const tmp = orders.filter(order => {
            if (order.id === Number.parseInt(value))
                return true;
            else if (order.farmerName.toUpperCase().startsWith(value.toUpperCase()))
                return true;
            else if (order.farmerSurname.toUpperCase().startsWith(value.toUpperCase()))
                return true;
            else if (order.state.toUpperCase().startsWith(value.toUpperCase()))
                return true;
            else if (order.listitems.find(item => item.name.toUpperCase().startsWith(value.toUpperCase())))
                return true;

            return false;
        });
        //TODO: complete this function
        setOrdersToShow(tmp);
    }, [orderToSearch, orders]);

    useEffect(() => {
        setLoading(true);
        API.getFarmerOrders()
            .then(all_orders => {
                setOrders(all_orders);
                setOrdersToShow(all_orders);
                setLoading(false);
            })
            .catch(e => {
                setLoading(false);
                setOrders([]);
                setOrdersToShow([]);
            }
            );
    }, [])


    return (
        <Col>
            {loading && <Alert variant='warning'> {alarm} Please wait while loading farmer orders... {alarm}</Alert>}
            {(orders.length && !loading) ?
                <ListGroup id="list" variant="primary" className="mb-5">
                    <ListGroup.Item variant="primary" key="title">
                        <h5 id="manager-farmer-orders-title">List of all the farmer orders</h5>
                    </ListGroup.Item>
                    <ListGroup.Item variant="secondary" key="explaination">
                        <h6 id="manager-farmer-orders-explaination">Delivery from farmers can be acknowledged from Monday 9:00 to Tuesday 21:00</h6>
                    </ListGroup.Item>
                    <ListGroup.Item variant="secondary" key="search">
                        <Form>
                            <Form.Group controlId="manager-farmer-orders-searching">
                                <Form.Control value={orderToSearch} placeholder="Filter farmer orders by id, farmer name, farmer surname, state or product"
                                    onChange={(event) => setOrderToSearch(event.target.value)} />
                            </Form.Group>
                        </Form>
                    </ListGroup.Item>

                    {ordersToShow.map(order => {
                        return (
                            <FarmerOrderItem key={order.id} order={order} validTime={validTime} />
                        );
                    })
                    }
                </ListGroup>
                : <Alert variant='danger'>No orders found.</Alert>
            }
        </Col>
    )
}

function FarmerOrderItem(props) {
    const [acked, setAcked] = useState(false);
    const [errorMsg, setErrorMsg] = useState(false);
    const [ackedSuccessfully, setAckedSuccessfully] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    let order = props.order;

    //useEffect for closing alert after 3 seconds
    useEffect(() => {
        if (ackedSuccessfully) {
            window.setTimeout(() => {
                setAckedSuccessfully(false);
            }, 3000)
        }
    }, [ackedSuccessfully]);

    const ackClicked = (orderid) => {
        setAcked(true);
        API.ackFarmerOrder(orderid)
            .then((newOrder) => {
                //returning an obj with id and state = "delivered"
                order.state = newOrder.state;
                setAcked(false);
                setErrorMsg(false);
                //this alert of successfully acked will disappear in 3 seconds
                setAckedSuccessfully(true);
            })
            .catch(e => {
                setAcked(false);
                setErrorMsg(true);
            })
    }

    return (
        <ListGroup.Item id={order.id} key={order.id}>
            <Row key="order-id">
                <h4><strong>Order id: {order.id}</strong></h4>
            </Row>
            <Row key="order-info">
                <Col sm={4}>
                    {/**ORDER INFO */}
                    <h5><strong>Order info</strong></h5>
                    <p className="lead"><u>
                        State: {acked ? <span className="bg-warning">delivered</span> : <span>{order.state}</span>} <br></br>
                        Total: {order.total.toFixed(2)}€<br></br>
                        Date: {order.time}<br></br>
                    </u>
                    </p>

                    {!showDetails ?
                        <Button variant="link" className="p-0" onClick={() => setShowDetails(true)}>Show more info</Button>
                        :
                        <>
                            <Button variant="link" className="p-0" onClick={() => setShowDetails(false)}>Hide more info</Button><br></br>
                            {/**This ol can be split into another function component */}
                            <ol data-testid="farmer-order-products">
                                {order.listitems.map(product => {
                                    return <li key={product.id}>
                                        <span><strong className="pr-3">{product.name}</strong></span>
                                        <span className="pr-3">Qty: <strong>{product.quantity}</strong></span>
                                        <span>Total: <strong>{product.price}€</strong></span>
                                    </li>
                                })}
                            </ol>

                        </>
                    }

                </Col>
                <Col sm={4}>
                    {/**FARMER INFO */}
                    <h5><strong>Farmer info</strong></h5>
                    <p>
                        Farmer id: {order.farmerid} <br></br>
                        Name: {order.farmerName} <br></br>
                        Surname: {order.farmerSurname}<br></br>
                    </p>
                </Col>
                <Col sm={4}>
                    {/**CONTROLS AND ALERT */}
                    {/**It's possible to set acknowledgment of delivery only at valid times */}
                    {(order.state === "pending" && props.validTime) &&
                        <Button className="mb-3" onClick={() => ackClicked(order.id)}>Acknowledge delivery</Button>
                    }
                    {
                        errorMsg && <Alert variant="danger">Error while trying to acknowledge delivery...</Alert>
                    }
                    {
                        ackedSuccessfully && <Alert variant="success">Order n.{order.id} acked successfully</Alert>
                    }
                </Col>
            </Row>
        </ListGroup.Item>
    )
}

function ManagerReports(props) {
    const [monthlyReports, setMonthlyReports] = useState([]);
    const [weeklyReports, setWeeklyReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [areThereReports, setAreThereReports] = useState(false);

    useEffect(() => {
        setLoading(true);
        API.getManagerReports()
            .then(all_reports => {
                let monthlyReportsArray = [];
                let weeklyReportsArray = [];
                for (let i = 0; i < all_reports.length; i++) {
                    if (all_reports[i].type === 0) {
                        weeklyReportsArray.push(all_reports[i])
                    }
                    else if (all_reports[i].type === 1) {
                        monthlyReportsArray.push(all_reports[i])
                    }
                }
                setMonthlyReports(monthlyReportsArray);
                setWeeklyReports(weeklyReportsArray);
                setLoading(false);
            })
            .catch(e => {
                setLoading(false);
                setMonthlyReports([]);
                setWeeklyReports([]);
            }
            );
    }, [])

    /* THIS IS WHAT THE ARRAYS LOOK LIKE
    let weekArray = [
        {
            type: 0,
            weekStartDate: "2021-11-01",
            weekEndDate: "2021-11-07",
            lostFood: {
               "Apples": 10,
               "Corn": 10,
               "Oranges": 30
            }
        },
        {
            type: 0,
            weekStartDate: "2021-11-08",
            weekEndDate: "2021-11-14",
            lostFood: {
               "Apples": 5,
               "Corn": 20,
               "Oranges": 12
            }
        },
        {
            weekStartDate: "2021-11-15",
            weekEndDate: "2021-11-21",
            lostFood: {
               "Apples": 0,
               "Corn": 7,
               "Oranges": 12
            }
        },
        {
            type: 0,
            weekStartDate: "2021-11-12",
            weekEndDate: "2021-11-28",
            lostFood: {
               "Apples": 11,
               "Corn": 17,
               "Oranges": 21
            }
        }
    ]

    let monthArray = [
        {
            type: 1,
            month: "9",
            year: "2021",
            lostFood: {
               "Apples": 30,
               "Corn": 28,
               "Oranges": 15
            }
        },
        {
            type: 1,
            month: "10",
            year: "2021",
            lostFood: {
               "Apples": 40,
               "Corn": 38,
               "Oranges": 30
            }
        },
        {
            type: 1,
            month: "11",
            year: "2021",
            lostFood: {
               "Apples": 26,
               "Corn": 54,
               "Oranges": 75
            }
        }
    ]
    */
    useEffect(() => {
        if (weeklyReports.length > 0 || monthlyReports.length > 0) {
            setAreThereReports(true);
        }
    })

    return (
        <>
            <ListGroup id="list" variant="primary" >
                <ListGroup.Item variant="primary" key="title">
                    <h2>Manager Reports</h2>
                </ListGroup.Item>
                <ListGroup.Item variant="light" key="information">
                    <h6>Reports are completely generated after each week and after each month. Only partial version are available before that.</h6>
                </ListGroup.Item>
            </ListGroup>

            <br></br>

            {loading && <Alert variant='warning'> {alarm} Please wait while the reports load {alarm}</Alert>}

            {(!loading && areThereReports) ?
                <Row>
                    <Col>
                        <ListGroup id="list" variant="primary" className="mb-5">
                            <ListGroup.Item variant="secondary" key="title monthly">
                                <h4>Monthly Reports</h4>
                            </ListGroup.Item>

                            {monthlyReports.map(report => {
                                return (
                                    <ReportMonthItem key = {report.year+"/"+report.month} report={report} />
                                );
                            })}

                        </ListGroup>
                    </Col>

                    <Col>
                        <ListGroup id="list" variant="primary" className="mb-5">
                            <ListGroup.Item variant="secondary" key="title weekly">
                                <h4>Weekly Reports</h4>
                            </ListGroup.Item>

                            {weeklyReports.map(report => {
                                return (
                                    <ReportWeekItem key = {report.weekStartDate+"/"+report.weekEndDate} report={report} />
                                );
                            })}

                        </ListGroup>
                    </Col>
                </Row>
                : <Alert variant='danger'>No reports found.</Alert>
            }
        </>
    )
}

function ReportWeekItem(props) {
    const [show, setShow] = useState(false);

    const ShowWeeklyReport = (() => {
        setShow(true);
    });

    const handleClose = () => {
        setShow(false);
    }

    let report = props.report;
    let foodArray = [];
    let total = 0;
    let entry;

    let monthArray = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ]

    let initialDateYear = report.weekStartDate.substring(0, 4);
    let finalDateYear = report.weekEndDate.substring(0, 4);
    let initialDateMonth = monthArray[report.weekStartDate.substring(5, 7).toString() - 1];
    let finalDateMonth = monthArray[report.weekEndDate.substring(5, 7).toString() - 1];
    let initialDateDay = report.weekStartDate.substring(8,);
    let finalDateDay = report.weekEndDate.substring(8,);

    let startDateWords = initialDateMonth + " " + initialDateDay + ", " + initialDateYear;
    let finalDateWords = finalDateMonth + " " + finalDateDay + ", " + finalDateYear;

    for (const [key, value] of Object.entries(report.lostFood)) {
        entry = {
            "Food": key,
            "Quantity": value
        }
        total += value;
        foodArray.push(entry);

    }

    return (
        <>
            <ListGroup.Item action variant="light" onClick={() => ShowWeeklyReport()}>
                <h6>{startDateWords} - {finalDateWords}</h6>
            </ListGroup.Item>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title><b>Week Report</b></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Week: from {report.weekStartDate} to {report.weekEndDate}</h5>
                    <h5>The following products were lost during this period:</h5>

                    <Table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>

                        <tbody>
                            {foodArray.map(food => {
                                return (
                                    <tr>
                                        <td> {food["Food"]} </td>
                                        <td> {food["Quantity"]} </td>
                                    </tr>
                                );
                            })}
                        </tbody>

                        <tfoot>
                            <tr>
                                <td>
                                    <h5><b>Total:</b></h5>
                                </td>
                                <td>
                                    <h5><b>{total}</b></h5>
                                </td>
                            </tr>
                        </tfoot>
                    </Table>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>

    )
}


function ReportMonthItem(props) {
    const [show, setShow] = useState(false);

    const ShowMonthlyReport = () => {
        setShow(true);
    }

    const handleClose = () => {
        setShow(false);
    }

    let report = props.report;
    let foodArray = [];
    let total = 0;
    let entry;

    for (const [key, value] of Object.entries(report.lostFood)) {
        entry = {
            "Food": key,
            "Quantity": value
        }
        total += value;
        foodArray.push(entry);

    }

    let monthArray = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ]

    return (
        <>
            <ListGroup.Item action variant="light" onClick={() => ShowMonthlyReport(report)} >
                <h6>{monthArray[report.month - 1]} {report.year}</h6>
            </ListGroup.Item>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title><b>{monthArray[report.month - 1]} {report.year} Report</b></Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <h5>The following food was lost during this month:</h5>

                    <Table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>

                        <tbody>
                            {foodArray.map(food => {
                                return (
                                    <tr>
                                        <td> {food["Food"]} </td>
                                        <td> {food["Quantity"]} </td>
                                    </tr>
                                );
                            })}
                        </tbody>

                        <tfoot>
                            <tr>
                                <td>
                                    <h5><b>Total:</b></h5>
                                </td>
                                <td>
                                    <h5><b>{total}</b></h5>
                                </td>
                            </tr>
                        </tfoot>
                    </Table>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}




export { ManagerPage, ManagerPageFarmerOrders, FarmerOrderItem, ManagerReports };