/**API for getting product info of the products of a specific farmer (farmerId)*/
async function getProductsOfFarmer(farmerToSearch) {
    //need to distringuish if they have passed an id or a string (which represent name or surname)
    let response = await fetch('/api/farmer/'+farmerToSearch+'/products');
    let responseBody = await response.json();
    if(response.ok) {
        return responseBody;
    }
    else {
        throw responseBody;  // an object with the error coming from the server
    }
}

/**API for setting the expected amount for the week for a specific product */
async function setExpectedQuantityForProduct(productId, quantity) {
    const product = {product: productId, quantity: quantity};
    const response = await fetch('/api/warehouse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      const responseBody = await response.json();
      if (response.ok) {
        return responseBody;
      } else { 
        throw responseBody;
      }
}

/**API that gets the orders given the farmer id*/
async function getOrdersOfFarmer(farmerId) {
  let response = await fetch('/api/farmerOrders/'+farmerId);
  let responseBody = await response.json();
  if(response.ok) {
      return responseBody;
  }
  else {
      throw responseBody;  // an object with the error coming from the server
  }
}

/**API that sets an order as confirmed*/
async function confirmOrder(orderId) {
  const response = await fetch('/api/confirmOrder/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({id: orderId}),
  });
  const responseBody = await response.json();
  if (response.ok) {
    return responseBody;
  } else { 
    throw responseBody;
  }
}

const API = { getProductsOfFarmer, setExpectedQuantityForProduct, getOrdersOfFarmer, confirmOrder };
export default API;
