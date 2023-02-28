import { WebSocketServer } from "ws";
import Client from "./client.mjs";
import { Views } from "./shared.mjs";

const wss = new WebSocketServer({ port: 3000 });

const commands = {
  quit(client, connection) {
    connection.ws.send("Command - quit");
    client.removeWebsocket(connection);
    connection.ws.terminate();
  },
  symbol: {
    price(client, connection, symbol) {
      connection.ws.send(`Command - symbol price for ${symbol}`);
      client.addWebsocket(connection, symbol, Views.PRICE);
    }, // Price view
    m(client, connection, symbol) {
      connection.ws.send(`Command - symbol matches for ${symbol}`);
      client.addWebsocket(connection, symbol, Views.MATCHES);
    }, // Matches view
    u(client, connection, symbol) {
      client.removeWebsocket(connection, symbol);
      connection.ws.send(`Command - symbol unsub to ${symbol}`);
    }, // Unsubscribe
  },
  system(client, { ws }, interval = null) {
    ws.send(`Command - system (interval: ${interval})\n `);
    if (interval && !isNaN(parseInt(interval))) {
      client.interval = Number(interval);
    }
  },
};

const CoinBaseClient = new Client();

wss.on("connection", (ws, req) => {
  const ip = req.socket.remoteAddress;

  ws.on("error", console.error);

  ws.on("message", function message(data) {
    data = data.toString();
    const command = data.split(" ")[0];
    if (Object.keys(commands).includes(command)) {
      commands[command](CoinBaseClient, { ws, ip }, data.split(" ")[1]);
    } else if (command.match(/[A-Z]{3}-[A-Z]{3}/)) {
      console.log("Found symbol");
      const symbolCommand = data.split(" ")[1] || "price";
      commands.symbol[symbolCommand](CoinBaseClient, { ws, ip }, command);
    } else {
      ws.send("Invalid command or invalid symbol (case sensitive)");
    }
  });
  ws.send("Connected to coinbase socket middleware.");
});
