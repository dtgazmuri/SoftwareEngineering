import axios from "axios";

import Product from "./Site/data/product";
import Farmer from "./Site/data/farmer";
import Order from "./Site/data/order";
import Customer from "./Site/data/customer";

async function login(credentials) {
  let response = await fetch("/api/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    return response.json();
  } else {
    try {
      const errDetail = await response.json();
      throw errDetail.message;
    } catch (err) {
      throw err;
    }
  }
}

async function logout() {
  await fetch("/api/sessions/current", { method: "DELETE" });
}

async function getAdmin() {
  const response = await fetch("/api/sessions/current");
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo;
  }
}

const BASEURL = "/api";

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

    if (response.ok) {
      try {
        const responseBody = await response.json();
        const list = [];
        for (const ex of responseBody) {
          const farmername = await fetchFarmerById(ex.farmerid);
          list.push(
            new Product(
              ex.id,
              ex.name,
              farmername,
              ex.price,
              ex.quantity,
              ex.availability
            )
          );
        }
        return list;
      } catch (er) {
        console.log(`error : ${er}`);
        return { error: `error ${er}` };
      }
    } else {
      return { error: ` error code ${response.status}` };
    }
  } catch (err) {
    return { error: `${err}` };
  }
}

/** The function returns the info over a farmer given it's id
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
    } else {
      return { error: ` error code ${response.status}` };
    }
  } catch (err) {
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
      const orders = [];
      try {
        const responseBody = await response.json();
        for (let order in responseBody) {
          const productlist = [];
          for (let product in responseBody.listitems) {
            productlist.push(Product.from(product));
          }
          orders.push(
            Order.from(
              order.id,
              order.customer,
              order.state,
              order.delivery,
              order.total,
              productlist
            )
          );
        }
        return orders;
      } catch (er) {
        console.log(`error : ${er}`);
        return { error: ` error code ${er}` };
      }
    } else {
      return { error: ` error code ${response.status}` };
    }
  } catch (err) {
    return { error: `${err}` };
  }
}

/** The function NEEDS to be called by the employee to create a new client order. The client needs a separate function because the client id needs to be taken from the cookie in that case.
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
 *                      "id":3,
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
  console.log(data);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      return {};
    } else {
      return { error: ` error code ${response.status}` };
    }
  } catch (error) {
    return { error: `${error}` };
  }
}

async function postOrderByCustomer(order_obj) {
  const url = `${BASEURL}/order/customer`;

  const data = order_obj;
  console.log(data);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      return {};
    } else {
      return { error: ` error code ${response.status}` };
    }
  } catch (error) {
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
    } else {
      return { error: ` error code ${response.status}` };
    }
  } catch (err) {
    return { error: `${err}` };
  }
}
async function notifyOfTime() {
  axios
    .post(BASEURL + "/notifyTime")
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      throw error;
    });
}
/*** FUNCTIONS TO IMPLEMENTS THE STORIES 6 AND 7 ***/

async function addNewUser(user) {
  axios
    .post(BASEURL + "/users/registration", user)
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      throw error;
    });
}

async function fetchCustomerById(id) {
  const url = `${BASEURL}/customers/${id}`;
  try {
    const response = await fetch(url);
    if (response.ok) {
      const responseBody = await response.json();
      return Customer.from(responseBody[0]);
    } else {
      return { error: ` error code ${response.status}` };
    }
  } catch (err) {
    return { error: `${err}` };
  }
}

async function fetchAllCustomers() {
  const url = `${BASEURL}/customers/get`;
  const response = await fetch(url);

  if (response.ok) {
    try {
      const responseBody = await response.json();
      console.log(responseBody);
      const customerlist = [];
      for (const customer of responseBody) {
        const c = new Customer(
          customer.id,
          customer.name,
          customer.surname,
          customer.wallet
        );
        customerlist.push(c);
      }
      return customerlist;
    } catch (er) {
      console.log(`error : ${er}`);
      return { error: ` error code ${er}` };
    }
  } else {
    return { error: `${response.status}` };
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

  const isPresent = await isUsernameAlreadyPresent(data.username);

  if (isPresent.error) {
    return { error: isPresent.error };
  } else if (isPresent) {
    return { error: "username is already present" };
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });

    if (response.ok) {
      return {};
    } else {
      return { error: ` error code ${response.status}` };
    }
  } catch (error) {
    return { error: `${error}` };
  }
}

async function getOrders() {
  let response = await fetch("/api/orders/all");
  let responseBody = await response.json();
  if (response.ok) {
    return responseBody;
  } else {
    throw responseBody; // an object with the error coming from the server
  }
}

async function getCustomers() {
  let response = await fetch("/api/customers/all");
  let responseBody = await response.json();
  if (response.ok) {
    return responseBody;
  } else {
    throw responseBody;
  }
}

async function updateCustomerWallet(value, id) {
  const response = await fetch("/api/customers/wallet/" + id + "/" + value, {
    method: "POST",
    headers: {
      "Content-Type": "application.json",
    },
    body: JSON.stringify(value),
  });
  const responseBody = await response.json();
  if (response.ok) {
    return responseBody;
  } else {
    throw responseBody;
  }
}

async function handOutOrder(id) {
  const aa = "handOut";
  let response = await fetch("/api/orders/" + id + "/handOut", {
    method: "POST",
    headers: {
      "Content-Type": "application.json",
    },
    body: JSON.stringify(aa),
  });
  let responseBody = await response.json();
  if (response.ok) {
    console.log(responseBody);
    return responseBody;
  } else {
    throw responseBody;
  }
}

/*** EXPORTS ***/

const API = {
  login,
  logout,
  getAdmin,
  fetchAllProducts,
  fetchFarmerById,
  fetchAllCustomers,
  getOrders,
  getCustomers,
  updateCustomerWallet,
  handOutOrder,
  isUsernameAlreadyPresent,
  postNewCustomer,
  fetchAllOrders,
  postOrderByEmployee,
  addNewUser,
  fetchCustomerById,
  postOrderByCustomer,
  notifyOfTime,
};

export default API;
