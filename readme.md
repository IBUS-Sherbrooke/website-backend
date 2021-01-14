# Backend Server API
Based on [this blog post](https://blog.dbi-services.com/build-api-backend-server-with-nodejs-and-postgresql/) by Furkan Suv - September 2020

---
## Prerequisites

 - [**nodejs**](https://nodejs.org/en/) latest version
   
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
- **pg**
	>NodeJS PostgreSQL connection “driver”
- **joi**
	>For validation
- **nodemon**
	>Restarts the server automatically on each file changes
---
## Project Structure


## Usage example

**GetAll:**
```
GET
http://[server adress]:[port]/api/printRequests
```

**Update:**
```
PUT
http://[server adress]:[port]/api/printRequests/[id]
body: {"name": "potato"}
```

**AddNew:**
```
POST
http://[server adress]:[port]/api/printRequests/[id]
body: {"name": "potato", "data": ... }
```

**Delete:**
```
DELETE
http://[server adress]:[port]/api/printRequests/[id]
```

## To be completed...
...