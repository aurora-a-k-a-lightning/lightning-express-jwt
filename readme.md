# Example of Express with Passport using JWT Strategy

This simulates a client calling a backend for authentication and retrieving a `JWT`.
The client then stores the `JWT` and uses it for subsequent api calls.

This is using the `Authorization` header strategy.

### Pre-reqs:
[node](https://nodejs.org/en/download/)

## Setup

* `npm install`
* `node index.js` - server will run at http://localhost:3000/
* open `index.html` in the browser, or serve it using a http-server, though this is not necessary for this example

## Important things

* the backend is found in `index.js`
* the frontend is found in `client.js`; no frameworks, libraries, or plugins used
