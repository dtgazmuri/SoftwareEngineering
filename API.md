# Group P13 - API Documentation

This document lists all of the methods and functions available in the API. They will be catalogued according to the information they aim to retrieve.

## Index

- [General](#general)
- [Orders](#orders)
- [Products](#products)
- [Customers](#customers)
- [Farmers](#farmers)

## General

#### Check if a Given User ID is Already Present

* HTTP method: `GET`  URL: `/api/username/present/:id`
* Description: Returns a boolean indicating the presence or absence of a certain user ID (True means the ID exists already)
* Request Body: _None_
* Successful Response: `200 OK`
* Error Response:  `404 Not Found`
* Response Body: A JSON object with a boolean describing presence of the username:

``` JSON
{
    "present": true
}
```

or

``` JSON
{
    "present": false
}
```

#### Create New User

* HTTP method: `POST`  URL: `/api/users/registration`
* Description: Creates a new user and adds it to the database.
* Request Body: A json object with the information of the new user:

``` JSON
{
    "id":1,
    "userid":"pending",
    "username":"yes", 
    "hash":"XXXX", 
    "role":"ROLE"
}
```

* Successful Response: `200 OK`
* Error Response:  `500 Server Error`
* Response Body: A JSON object with the ID of the new user:

``` JSON
{
    "userid":1
}
```

#### Update Customer Wallet (Not ready)

* HTTP method: `POST`  URL: `/api/customers/wallet/:id/:value`
* Description: Adds money to a customer's wallet.
* Request Body: A JSON object with the value to be added to the wallet:

``` JSON
{
    "value": "value"
}
```

* Successful Response: `200 OK`
* Error Response:  `500 DB error when updating wallet` or `422 Error in Parameters`
* Response Body: _None_

#### Login

* HTTP method: `POST`  URL: `/api/sessions`
* Description: Uses the received credentials to try to log in a user.
* Request Body: A JSON object with the credentials of the user:

``` JSON
{
    "username": "username",
    "password": "password"
}
```

* Successful Response: `200 OK`
* Error Response:  `404 Not Found`
* Response Body: The user's information.

``` JSON
{
    "id": "id",
    "userid": "userid",
    "username": "username",
    "role": "role"
}
```

#### Logout

* HTTP method: `DELETE`  URL: `/api/sessions/current`
* Description: Logs out the current logged in user.
* Request Body: _None_
* Successful Response: `200 OK`
* Error Response:  `404 Not Found`
* Response Body: _None_

#### Check if User is an Administrator

* HTTP method: `GET`  URL: `/api/sessions/current`
* Description: Authenticates the current user, checking if they are an administrator .
* Request Body: _None_
* Successful Response: `200 OK`
* Error Response:  `401 Unauthenticated user`
* Response Body: _None_

## Orders

#### Get All Orders

* HTTP method: `GET`  URL: `/api/orders/all`
* Description: Retrieves a list of all orders stored in the database.
* Request Body: _None_
* Successful Response: `200 OK`
* Error Response:  `404 Not Found`
* Response Body: An array of JSON objects (one for each order stored in the database).

``` JSON
[
    {
        "id":1,
        "customerid":1,
        "state":"delivered",
        "delivery":"False",
        "total":72.25,
        "listitems":
            [
                {
                    "id":1,
                    "orderid":1,
                    "productid":1,
                    "quantity":10,
                    "price":19
                },
                {
                    "id":2,
                    "orderid":1,
                    "productid":2,
                    "quantity":15,
                    "price":53.25
                }
            ]
    },
    {},
    {}
]
```

#### Add a New Order to the Database by Employee

* HTTP method: `POST`  URL: `/api/order/employee`
* Description: Posts a new order to the database. Only an employee can post with this URL.
* Request Body: A JSON object describing the order:

``` JSON
{
    "customerid":1,
    "state": "pending",
    "delivery": "False/True", 
    "total":9.90,
    "date": "YYYY-MM-DD 00:00",
    "address": "Shop/Client Address",
    "listitems":
        [
            {
                "productid":3,
                "quantity":10, 
                "price":9.90
            },
            {},
            {}
        ]
}
```

* Successful Response: `200 OK`
* Error Response:  `500 Server Error` or `422 Error in Parameters`
* Response Body: An object with the ID of the created order

``` JSON
{
    "orderid": 1
}
```

#### Add a New Order to the Database by Customer

* HTTP method: `POST`  URL: `/api/order/customer`
* Description: Posts a new order to the database. The order is "pending" until an employee approves it.
* Request Body: A JSON object describing the order:

``` JSON
{
    "customerid":1,
    "state": "pending",
    "delivery": "False/True", 
    "total":9.90,
    "date": "YYYY-MM-DD 00:00",
    "address": "Shop/Client Address",
    "listitems":
        [
            {
                "productid":3,
                "quantity":10, 
                "price":9.90
            },
            {},
            {}
        ]
}
```

* Successful Response: `200 OK`
* Error Response:  `500 Server Error` or `422 Error in Parameters`
* Response Body: An object with the ID of the created order

``` JSON
{
    "orderid": 1
}
```

#### Hand-Out Order

* HTTP method: `POST`  URL: `/api/orders/:id/handOut`
* Description: Changes the status of an order from "Pending" to "Delivered"
* Request Body: A JSON object saying "handOut".
* Successful Response: `200 OK`
* Error Response:  `500 Server Error` or `422 Error in Parameters`


#### Orders pending cancellation

* HTTP method: `GET`  URL: `/api/orders/insufficientWallet`
* Description: Retrieves a list of orders pending cancellation (i.e. their total amount is higher than current customer wallet)
* Request Body: _None_
* Successful Response: `200 OK`
* Error Response:  `404 Not Found` or `401 Not authenticated` or `401 Unauthorized action`
* Response Body: An array of JSON objects like the one below.
``` JSON
[
    {
        "id": 1,
        "customerid": 1,
        "state": "pending",
        "delivery": "False",
        "total": 73.21,
        "customerName": "Giovanna",
        "customerSurname": "Arco",
        "customerUsername": "giovanna.arco@gmail.com",
        "customerWallet": 10
    },
    {}
]
```


## Products

#### Get the List of Products

* HTTP method: `GET`  URL: `/api/products/all`
* Description: Retrieves the list of available products.
* Request body: _None_
* Successful response: `200 Ok`
* Error response:  `404 Not Found`
* Response body: An array of JSON objects (one for each product stored in the database).

``` JSON
[
    {
        "id": "id",
        "name": "name",
        "farmerid": "farmer id",
        "price":"price",
        "quantity":"quantity"
    },
    {},
    {}
]
```

#### Get the List of Products of a Specific Farmer

* HTTP method: `GET`  URL: `/api/farmer/+farmerId+/products`
* Description: Retrieves the list of products a specific farmer offers.
* Request Body: _None_
* Successful Response: `200 Ok`
* Error Response:  `500 Server Error`
* Response Body: An array of JSON objects, each corresponding to a product.

``` JSON
[
    {
        "id": "id",
        "name": "name",
        "farmerid": "farmer id",
        "price":"price",
    },
    {},
    {}
]
```

#### Set Expected Amount of Product for Next Week

* HTTP method: `POST`  URL: `/api/warehouse`
* Description: A farmer saves in the database how much of a certain product they expect to have the following week.
* Request Body: A JSON object with the product and the expected amount of it:

``` JSON

    {
        "product": "product ID",
        "quantity": "quantity"
    }

```

* Successful Response: `200 OK`
* Error Response:  `500 Server Error` or `422 Error in Parameters`
* Response Body: _None_

## Customers

#### Get the List of Customers

* HTTP method: `GET`  URL: `/api/customerlist`
* Description: Retrieves a list of all customers stored in the database.
* Request Body: _None_
* Successful Response: `200 OK`
* Error Response:  `404 Not Found`
* Response Body: An array with one JSON object for each customer in the database:

``` JSON
[
    {
        "id":1,
        "name":"Giovanna",
        "surname":"Arco",
        "wallet":0
    },
    {
        "id":2,
        "name":"marcello",
        "surname":"fumagalli",
        "wallet":0
    },
    {
        "id":3,
        "name":"chiara",
        "surname":"malannati",
        "wallet":0
    }
    {},
    {}
]
```

#### Add a New Customer to the Database

* HTTP method: `POST`  URL: `/api/customer`
* Description: Posts a new customer to the database.
* Request Body: A JSON object describing the customer:

``` JSON
{
    "name": "name", 
    "surname": "surname", 
    "username": "e-mail", 
    "hash": "hash"
}
```

* Successful Response: `200 OK`
* Error Response:  `500 Server Error` or `422 Error in Parameters`
* Response Body: A JSON object with the ID of the new customer:

``` JSON
{
    "userid": 3
}
```

#### Get Customer by ID

* HTTP method: `GET`  URL: `/api/customers/:id`
* Description: Retrieves the available information for the customer with that ID.
* Request Body: _None_
* Successful Response: `200 OK`
* Error Response: `500 Server Error`
* Response Body: A JSON object describing the desired customer.

``` JSON
{
    "id":1,
    "name":"Roberto",
    "surname":"Rossi",
    "wallet":50
}
```

## Farmers

#### Get Farmer by ID

* HTTP method: `GET`  URL: `/api/farmer/:id`
* Description: Retrieves the available information for the farmer with that ID.
* Request Body: _None_
* Successful Response: `200 OK`
* Error Response: `500 Server Error` or `404 Not Found`
* Response Body: A JSON object describing the desired farmer.

``` JSON
{
    "id":1,
    "name":"Tunin",
    "surname":"Lamiera"
}
```
