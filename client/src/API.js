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
 * @returns An object containing the farmer info OR an object containing the field "error" if something went wrong. The object has the following format:
 *      {
 *          "id":1,
 *          "name":"Tunin",
 *          "surname":"Lamiera"
 *      }
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
 * @returns an array of json objects in this format:
 *      [
 *          {
 *              "id":1,
 *              "customerid":1,
 *              "state":"pending",
 *              "delivery":"no",
 *              "total":72.25,
 *              "listitems":
 *                  [
 *                      {
 *                          "id":1,
 *                          "orderid":1,
 *                          "productid":1,
 *                          "quantity":10,
 *                          "price":19
 *                      },
 *                      {
 *                          "id":2,
 *                          "orderid":1,
 *                          "productid":2,  
 *                          "quantity":15,
 *                          "price":53.25
 *                      }
 *                  ]
 *          },
 *          {},
 *          {},
 *          ...
 *      ]     
 * 
 *      or an ojbect with the error field if something went wrong   
 */
async function fetchAllOrders() {

  const url = `${BASEURL}/orders/all`;



  try {
    const response = await fetch(url);

    if (response.ok) {

      console.log("ok");

      try {
        const responseBody = await response.json();
        return responseBody;
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



/** The function returns true if the username is already oresent, false otherwise
 * 
 * @param {string} username The username to check
 * @returns true if the username is already oresent, false otherwise
 */
 async function isUsernameAlreadyPresent(username) {

  const url = `${BASEURL}/username/present/${username}`;

  try {
    const response = await fetch(url);

    if (response.ok) {
      const responseBody = await response.json();
      return responseBody.present;
    }
    else {
      return { error: ` error code ${response.status}` };
    }
  }
  catch (err) {
    return { error: `${err}` };
  }
}



/** The function stores a new customer on the DB
 * 
 * @param {object} customer_obj The object containing the data of the customer, in the format:
 * 
 *      {
 *          "name": "marcello", 
 *          "surname": "fumagalli", 
 *          "username": "marcello.fumagalli@polito.it", 
 *          "hash": "hash_tarocco"
 *      }
 * 
 * @returns an object with the userid, if it's created right, or an ojbect with the error field if something went wrong
 */
 async function postNewCustomer(customer_obj) {

  const url = `${BASEURL}/customer`;

  const data = customer_obj;

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
  postOrderByEmployee,

  isUsernameAlreadyPresent,
  postNewCustomer
}
export default API;