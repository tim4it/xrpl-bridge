# XRPL Bridge service
Monitors wallets and their activity on the XRP Ledger. Both **back-end** and **front-end** projects are included, **postgres** database is used.

## Update packages
Update packages in the project:
```
npx npm-check-updates -u
```

# Local development
We can start local development - start only with postgres database on docker - back-end and front-end can start locally:

1. build postgres database:
    ```
    docker-compose -f docker-compose.local.yml up
    ```
2. build back-end - go to **/backend** directory and execute command. Back-end will start on port **3000**:
    ```
    npm start
    ```
3. build front-end - go to **/frontend** directory and execute command. Front-end will start on port **3001**:
    ```
    npm start
    ```
4. Open browser and start front-end application on address:
    ```
    http://localhost:3001/
    ```
# Demo

Start all components - database, back-end and front-end using docker. All components are packed into docker. Building with no cache:
```
docker-compose -f docker-compose.docker.yml build --no-cache
```
Build all components:
```
docker-compose -f docker-compose.docker.yml up
```
Remove all components:
```
docker-compose -f docker-compose.docker.yml down
```

### Back-end

We can see swagger documentation in demo mode. All endpoints and DTOs are described. Back-end starts at port **3000**:
```
http://localhost:3000/api/
```
### Front-end

Start front-end application:
```
http://localhost:3001/
```
Features:
- create and see wallet information - created wallets are monitored for transactions
- send transaction with amount from source to destination wallet address
- view all transaction between monitor wallets. Support filtered search by wallet address
- view account info from provided wallet address

# Testing

There are tests in the back-end module - unit tests (tests can be started without application running). Go to **/backend** directory and start:
```
npm start
```

# Endpoint description

Swagger documentation is provided for describing all endpoints in the **back-end**. There are two types of endpoints:
- wallet (CRUD variant)
- transaction - search and create

Documentation can be found (before execute **local** backend module or **demo** mode):
```
http://localhost:3000/api/
```
