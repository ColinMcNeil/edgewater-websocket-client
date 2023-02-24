import { WebSocketServer } from "ws";
import Client from "./client.mjs";

const wss = new WebSocketServer({ port: 3000 });

const commands = {
  quit() {},
  m() {},
  u() {},
  symbol() {},
};

const client = new Client();

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  ws.on("message", function message(data) {
    console.log("received: %s", data);
  });

  ws.send("something");
});
