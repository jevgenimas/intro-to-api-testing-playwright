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

| ID    | Description                      | Input data                          | Expected answer           |
|-------|----------------------------------|-------------------------------------|---------------------------|
| TC01  | Negative decision (income = 0)   | income=0, debt=0, age=30, ...       | 400 Bad Request           |
| TC02  | Medium risk                      | income=2000, debt=500, age=25, ...  | 200 OK, riskLevel=Medium  |
| TC03  | Low risk                         | income=3000, debt=0, age=30, ...    | 200 OK, riskLevel=Low     |
| TC04  | High risk                        | income=1000, debt=900, age=20, ...  | 200 OK, riskLevel=High    |
| TC05  | Debt < 0                         | income=2000, debt=-1, age=28, ...   | 400 Bad Request           |
| TC06  | Age = 16                         | income=2000, debt=0, age=16, ...    | 400 Bad Request           |
 