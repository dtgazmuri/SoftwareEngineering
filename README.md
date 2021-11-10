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
