//API for getting farmer orders
async function getFarmerOrders() {
    let response = await fetch('/api/farmerOrders/all');
    let responseBody = await response.json();
    if(response.ok) {
        return responseBody;
    }
    else {
        throw responseBody;  // an object with the error coming from the server
    }
}
const API = { getFarmerOrders };
export default API;
