# Edgewater Websocket Client Middleware

A basic websocket server/client to serve as a middleware between CoinBase public websocket feed and `n` clients.

## Installation/Setup

Requires node `v13.2.0` or later to make use of [MJS Support](https://nodejs.org/api/esm.html)

`npm install` or `yarn install`

`npm run start` or `yarn start`

## Configuration

Default listener port & feed intervals are hard-coded for the scope of this project. They can be found within `server.mjs` for the listener port, and `client.mjs` for the interval value.
