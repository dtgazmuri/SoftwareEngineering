import Product from "./Site/data/product"
import Farmer from "./Site/data/farmer"
import Order from "./Site/data/order"
async function login(credentials) {
  let response = await fetch('/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    console.log(user)
    return user;
  }
  else {
    try {
      const errDetail = await response.json();
      throw errDetail.message;
    }
    catch (err) {
      throw err;
    }
  }
}

async function logout() {
  await fetch('/api/sessions/current', { method: 'DELETE' });
}

async function getAdmin() {
  const response = await fetch('/api/sessions/current');
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo;
  }
}






const BASEURL = '/api';

/*** FUNCTIONS TO IMPLEMENTS THE STORIES 1 AND 3 ***/

/** The function returns an array filled with json object, one for each product stored in the DB
 * 
 * @returns an array of json objects in this format:
 *      [
    *      {
    *          "id":1,
    *          "name":"Red Apple",
    *          "farmerid":1,
    *          "price":1.9,
    *          "quantity":100
    *      },
    *      {},
    *      {},
    *      ...
 *      ]
 * 
 *      or an ojbect with the error field if something went wrong
 */
async function fetchAllProducts() {

  const url = `${BASEURL}/products/all`;

  try {
    const response = await fetch(url);

    console.log("hello");

    if (response.ok) {

      try {
        const responseBody = await response.json();
        const list = []; 
        for (const ex of responseBody){
           const farmername =  await fetchFarmerById(ex.farmerid);
           list.push(new Product(ex.id, ex.name, farmername, ex.quantity, ex.price))
          };
        return list;
      }
      
      catch (er) {
        console.log(`error : ${er}`);
        return { error: `error ${er}` };
      }
    }
    else {
      return { error: ` error code ${response.status}` };
    }
  }
  catch (err) {
    return { error: `${err}` };
  }
}

/** The function returns the info over a farmer given its id
 * 
 * @param {numeric} farmer_id The unique id of the farmer to fecth
 * @returns A Farmer object containing the farmer info 
 */
async function fetchFarmerById(farmer_id) {

  const url = `${BASEURL}/farmer/${farmer_id}`;

  try {
    const response = await fetch(url);

    if (response.ok) {
      const responseBody = await response.json();
      return Farmer.from(responseBody);
    }
    else {
      return { error: ` error code ${response.status}` };
    }
  }
  catch (err) {
    return { error: `${err}` };
  }
}



/** The function returns an array filled with json object, one for each order stored in the DB
 * 
 * @returns an array of Order objects:
 *      or an ojbect with the error field if something went wrong   
 */
async function fetchAllOrders() {

  const url = `${BASEURL}/orders/all`;
  try {
    const response = await fetch(url);

    if (response.ok) {

      console.log("ok");
      const orders = []
      try {
        const responseBody = await response.json();
        for (let order in responseBody){
          const productlist = []
          for(let product in responseBody.listitems){
            productlist.push(Product.from(product))
          }
        //const customer = await getCustomerByID(responseBody.customerid)  
        orders.push(Order.from(order.id, order.customer, order.state, order.delivery, order.total, productlist))
          
        }
        return orders;
      }
      catch (er) {
        console.log(`error : ${er}`);
        return { error: ` error code ${er}` };
      }


    }
    else {
      return { error: ` error code ${response.status}` };
    }
  }
  catch (err) {
    return { error: `${err}` };
  }
}



/** The function NEEDS to be called by the employee to create a new client order. The clinet needs a separate function because the client id needs to be taken from the cookie in that case.
 * 
 * @param {object} order_obj The object containing the data of the order, in the format:
 * 
 *      {
 *          "customerid":1,
 *          "state":"pending",
 *          "delivery":"yes", 
 *          "total":9.90, 
 *          "listitems":
 *              [
 *                  {
 *                      "productid":3,
 *                      "quantity":10, 
 *                      "price":9.90
 *                  }
 *              ]
 *      }
 * 
 *      Note that the total field needs to be equal to the sum of the prices of the items inside it; and that the price of an item is it's unit price * quantity
 * 
 * @returns an object with the order id, if it's created right, or an ojbect with the error field if something went wrong
 */
async function postOrderByEmployee(order_obj) {

  const url = `${BASEURL}/order/employee`;

  const data = order_obj;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data) // body data type must match "Content-Type" header
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



/*** EXPORTS ***/


const API = {
  login,
  logout,
  getAdmin,
  
  fetchAllProducts,
  fetchFarmerById,
  fetchAllOrders,
  postOrderByEmployee
}
export default API;