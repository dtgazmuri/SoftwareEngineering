#### Get the product list

* HTTP method: `GET`  URL: `/api/products/all
* Description: fetch the list of available products
* Request body: _None_

* Response: `200 Ok` (success)
* Response body: an array filled with json object, one for each product stored in the DB

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
    {},
    ...
]
```

* Error responses:  `404 Not Found`


#### Get Farmer by id

* HTTP method: `GET`  URL: `/api/farmer/:id`
* Description: retrieve the farmer information given by its id
* Request body: _None_
* Response: `200 OK` (success)
* Response body: One object describing the required farmer:

``` JSON
{
    "id":1,
    "name":"Tunin",
    "surname":"Lamiera"
}
```

* Error responses:  `500 Server Error`


#### Get All Orders

* HTTP method: `GET`  URL: `/api/orders/all`
* Description: retrieve a list of all orders stored in the DB
* Request body: _None_
* Response: `200 OK` (success)
* Response body: An array with one object for each order in the DB:

``` JSON
[
    {
        "id":1,
        "customerid":1,
        "state":"delivered",
        "delivery":"no",
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
    {},
    ...
]
```

* Error responses:  `404 Not Found`


#### Add a new order on the DB

* HTTP method: `POST`  URL: `/api/order/employee`
* Description: post a new order on the DB
* Request body: an object describing the order:

``` JSON
{
    "customerid":1,
    "state":"pending",
    "delivery":"yes", 
    "total":9.90, 
    "listitems":
        [
            {
                "productid":3,
                "quantity":10, 
                "price":9.90
            },
            {},
            {},
            ...
        ]
}
```

* Response: `200 OK` (success)
* Response body: An object with the ID of the created order

``` JSON
{
    "orderid": 1
}
```

* Error responses:  `500 Server Error`


#### Check if a given username is already present

* HTTP method: `GET`  URL: `/api/username/present/:id`
* Description: retrieve true or false accodring if the given username (:id) is already used or not
* Request body: _None_
* Response: `200 OK` (success)
* Response body: One object describing presence of the username:

``` JSON
{
    "present": true/false
}
```

* Error responses:  `404 Not Found`


#### Get the customer list

* HTTP method: `GET`  URL: `/api/customerlist`
* Description: retrieve a list of all customers stored in the DB
* Request body: _None_
* Response: `200 OK` (success)
* Response body: An array with one object for each customer in the DB:

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
    {},
    ...
]
```

* Error responses:  `404 Not Found`


#### Add a new customer on the DB

* HTTP method: `POST`  URL: `/api/customer`
* Description: post a new customer on the DB
* Request body: an object describing the customer:

``` JSON
{
    "name": "marcello", 
    "surname": "fumagalli", 
    "username": "marcello.fumagalli@polito.it", 
    "hash": "hash"
}
```

* Response: `200 OK` (success)
* Response body: An object with the ID of the created user id

``` JSON
{
    "userid": 3
}
```

* Error responses:  `500 Server Error`
