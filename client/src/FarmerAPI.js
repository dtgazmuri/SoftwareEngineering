/**API for getting product info of the products of a specific farmer (farmerId)*/
async function getProductsOfFarmer(farmerId) {
    let response = await fetch('/api/farmer/'+farmerId+'/products');
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


const API = { getProductsOfFarmer, setExpectedQuantityForProduct };
export default API;
