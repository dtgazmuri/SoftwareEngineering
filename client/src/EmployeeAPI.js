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

async function getCustomers() {
    let response = await fetch('/api/customers/all');
    let responseBody = await response.json();
    if(response.ok) {
        return responseBody;
    }
    else {
        throw responseBody;
    }
}

async function updateCustomerWallet(value, id) {
    let response;
    if (!isNaN(value)) {
        response = await fetch('/api/customers/wallet/'+id+'/'+value, {
            method: 'POST',
            headers: {
                'Content-Type': 'application.json',
            },
            body: JSON.stringify(value),
        });
    }
    console.log(response);
    const responseBody = await response.json();
    if(response.ok) {
        return responseBody;
    }
    else {
        throw responseBody;
    }
}

async function handOutOrder(id) {
    const aa = "handOut";
    let response = await fetch('/api/orders/'+id+'/handOut', {
        method: 'POST',
        headers: {
            'Content-Type': 'application.json',
        },
        body: JSON.stringify(aa),
    });
    let responseBody = await response.json();
    if(response.ok) {
        return responseBody;
    }
    else {
        throw responseBody;
    }
}

async function lostOrderStatus(id) {
    const aa = "lost";
    let response = await fetch('/api/orders/'+id+'/reportLost', {
        method: 'POST',
        headers: {
            'Content-Type': 'application.json',
        },
        body: JSON.stringify(aa),
    });
    let responseBody = await response.json();
    if(response.ok) {
        return responseBody;
    }
    else {
        throw responseBody;
    }
}

async function getOrdersWithInsufficientWalletBalance() {
    let response = await fetch('/api/orders/insufficientWallet');
    let responseBody = await response.json();
    if(response.ok) {
        return responseBody;
    }
    else {
        throw responseBody;  // an object with the error coming from the server
    }
}

async function postLostFood(order_obj) {
    const url = '/api/lostfood';
    const data = order_obj;
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) 
      });
  
      if (response.ok) {
        return {};
      }
      else {
        return { error: ` error code ${response.status}` };
      }
    }
    catch (error) {
      return { error: `${error}` };
    }
  }

async function getProductById(id) {
    const url = '/api/product/'+id;
    const response = await fetch(url);
    let responseBody = await response.json();
    if(response.ok) {
        return responseBody;
    }
    else {
        throw responseBody;  // an object with the error coming from the server
    }

}


const API = { getOrders, getCustomers, updateCustomerWallet, handOutOrder, lostOrderStatus, getOrdersWithInsufficientWalletBalance, postLostFood, getProductById };
export default API;
