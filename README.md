| HTTP   | Endpoint          | Description                | Parameters                             | Response Code             |
|--------|-------------------|----------------------------|----------------------------------------|---------------------------|
| GET    | /test-orders      | Successful login           | username=valid, password=valid         | 200 OK                    |
| GET    | /test-orders      | Bad Request                | one of the parameters is missing       | 500 Internal Server Error |
| GET    | /test-orders      | Too many requests          | request limit exceeded                 | 429 Too Many Requests     |
| DELETE | /test-orders/{id} | Order deleted successfully | id=valid, api_key=valid                | 204 No Content            |
| DELETE | /test-orders/{id} | Bad Request                | id='abc' or id is missing              | 400 Bad Request           |
| DELETE | /test-orders/{id} | Unauthorized               | api_key is missing / invalid key       | 401 Unauthorized          |
| DELETE | /test-orders/{id} | Method Not Allowed         | id is missing                          | 405 Method Not Allowed    |
| DELETE | /test-orders/{id} | Too many requests          | request limit exceeded                 | 429 Too Many Requests     |
| PUT    | /test-orders/{id} | Order updated successfully | id=1, api_key=16-character, valid body | 200 OK                    |
| PUT    | /test-orders/{id} | Bad Request                | invalid id                             | 400 Bad Request           |
| PUT    | /test-orders/{id} | Unauthorized               | api_key is missing / invalid           | 401 Unauthorized          |
| PUT    | /test-orders/{id} | Method Not Allowed         | id is missing                          | 405 Method Not Allowed    |
| PUT    | /test-orders/{id} | Too many requests          | request limit exceeded                 | 429 Too Many Requests     |

