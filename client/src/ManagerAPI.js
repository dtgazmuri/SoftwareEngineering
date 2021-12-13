//API for getting farmer orders
async function getFarmerOrders() {
    let response = await fetch('/api/farmerOrders');
    let responseBody = await response.json();
    if(response.ok) {
        return responseBody;
    }
    else {
        throw responseBody;  // an object with the error coming from the server
    }
}

//API for acking the delivery of a farmer order
async function ackFarmerOrder(orderid) {
    //building an obj containing the order id and "delivered" as newState
    const order = {id: orderid, newState: "delivered"};
    let response = await fetch('/api/farmerOrders/'+orderid+'/ack', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });
    let responseBody = await response.json();
    if(response.ok) {
        return responseBody;
    }
    else {
        throw responseBody;  // an object with the error coming from the server
    }
}


const API = { getFarmerOrders, ackFarmerOrder };
export default API;
