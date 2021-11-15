#### Register new user

* HTTP method: `POST`  URL: `/api/users/registration
* Description: Register a new user
* Request body: description of the user 
``` JSON
{
    "name": "name",
    "surname": "surname",
    "username": "username",
    "password":"password",
    "role":"client"
}
```

* Response: `201 Created` (success)
* Response body:  no content
* Error responses:  `500 Internal Server Error` (generic error), `409 Conflict` (user already exists), `400 Bad Request`


#### Get Customer by User id

* HTTP method: `GET`  URL: `/api/customers/:id`
* Description: retrieve the customer information given by its id
* Request body: _None_
* Response: `200 OK` (success)
* Response body: One object describing the required customer:

``` JSON
 {
        "ID": 2,
        "NAME": "setare",
        "SURNAME": "askari",
        "WALLET": 100
    }
```

* Response: `200 Created` (success)
* Response body:  no content
* Error responses:  `500 Internal Server Error` (generic error), `404 not found`



