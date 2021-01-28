# Backend Server API
Based on [this blog post](https://blog.dbi-services.com/build-api-backend-server-with-nodejs-and-postgresql/) by Furkan Suv - September 2020

---
## Prerequisites

 - [**nodejs**](https://nodejs.org/en/) latest version
 - [**Mysql workbench community**](https://dev.mysql.com/downloads/workbench/) (optional, only for creating a local database)
 - [**Mysql Server community**](https://dev.mysql.com/downloads/mysql/) (optional, only for hosting a local database)
   
Run the following command the in project environnement to install the required librairies 
```
npm install 
```
The following librairies will be installed:
- **express** 
  	>Framework to handle requests and responses
- **dotenv**
  	>Reads from .env file and adds into process variable which is readable globally
- **sequelize**
	>Sequelize is a promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server. It features solid transaction support, relations, eager and lazy loading, read replication and more.
- **mysql2**
	>NodeJS Mysql connection driver
- **joi**
	>For validation
- **nodemon**
	>Restarts the server automatically on each file changes
- **Typescript and ts-node**

---
## Building and Debugging
To debug, run (nodemon)
```
npm start 
```

To build, run 
```
tsc 
```

## Project Structure

- **routes**: Definition of api routes 
- **controllers**: Controls the workflow of the requests and response by calling services and validators, 1 per route
- **services**: Executer of the request, 1 per route
- **validators**: Validates the request before execution
- **configs**: Simple global config objects. Reads the .env attributes
- **db**: Database model and connection (TODO)
- **.env**: Environnment variables
- **index.js**: Main app entry point

## Usage example

Default environnement variable are in .env

You can test with [**Postman**](https://www.postman.com/downloads/)

Postman request example in [IBUS_printRequest.postman_collection.json](IBUS_printRequest.postman_collection.json)

`GetAll`:
```
GET
http://[server adress]:[port]/api/printRequests

GET
http://[server adress]:[port]/api/printRequestsHistory
```

`Current mocks`:
```
GET
http://[server adress]:[port]/api/printRequests/mock

GET
http://[server adress]:[port]/api/printRequestsHistory/mock
```

`Update`:
```
PUT
http://[server adress]:[port]/api/printRequests/[id]
body: {"name": "potato", "print_data": *file* ...}
```

`AddNew`:
```
POST /api/printRequests HTTP/1.1
Host: localhost:2000
Content-Length: 458
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

----WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="print_data"; filename="/C:/Gegi/S7/Projet/Databases/ibus_test_script.sql"
Content-Type: <Content-Type header here>

(data)
----WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="name"
Content-Type: application/json

potato
----WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="description"

desc test
----WebKitFormBoundary7MA4YWxkTrZu0gW

```

`Delete`:
```
DELETE
http://[server adress]:[port]/api/printRequests/[id]
```
## DataBase
Take a look at [the database setup](https://github.com/IBUS-Sherbrooke/website-database) repo. 

## To be completed...
...