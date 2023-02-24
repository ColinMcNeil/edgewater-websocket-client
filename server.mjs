import { WebSocketServer } from "ws";
import Client from "./client.mjs";

const wss = new WebSocketServer({ port: 3000 });

const commands = {
  quit(client, ws) {
    ws.send("Command - quit");
  },
  symbol: {
    price(client, ws, symbol) {
      ws.send(`Command - symbol price for ${symbol}`);
    },
    m(client, ws, symbol) {
      ws.send(`Command - symbol matches for ${symbol}`);
    }, // Matches view
    u(client, ws, symbol) {
      ws.send(`Command - symbol unsub to ${symbol}`);
    }, // Unsubscribe
  },
  system(client, ws, interval = null) {
    ws.send(`Command - system (interval: ${interval})`);
  },
};

const CoinBaseClient = new Client();

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  ws.on("message", function message(data) {
    data = data.toString();
    const command = data.split(" ")[0];
    if (Object.keys(commands).includes(command)) {
      commands[command](CoinBaseClient, ws, data.split(" ")[1]);
    } else if (command.match(/[A-Z]{3}-[A-Z]{3}/)) {
      console.log("Found symbol");
      const symbolCommand = data.split(" ")[1] || "price";
      commands.symbol[symbolCommand](CoinBaseClient, ws, command);
    } else {
      ws.send("Invalid command or invalid symbol (case sensitive)");
    }
  });

  ws.send("Connected to coinbase socket middleware.");
});
