/**API per prendere le info generali (id, titolo e, se utente loggato, il numero delle risposte ricevute) */
async function getOrders() {
    let response = await fetch('/api/orders/all');
    let responseBody = await response.json();
    if(response.ok) {
        return responseBody;
    }
    else {
        throw responseBody;  // an object with the error coming from the server
    }
}


const API = { getOrders };
export default API;
