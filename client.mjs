import WebSocket from "ws";
import { Views } from "./shared.mjs";

/**
 * CoinBase Websocket Client
 */
class Client {
  ws = null;
  openWebsockets = [];
  buffer = [];
  interval = 250;

  constructor(symbols = ["BTC-USD", "ETH-USD", "XRP-USD", "LTC-USD"]) {
    this.ws = new WebSocket("wss://ws-feed.exchange.coinbase.com ");
    this.ws.on("error", console.error);
    this.ws.on("open", () => {
      this.ws.send(
        JSON.stringify({
          type: "subscribe",
          product_ids: symbols,
          channels: [
            "level2",
            "heartbeat",
            {
              name: "ticker",
              product_ids: symbols,
            },
          ],
        })
      );
    });
    this.ws.on("message", (data) => {
      this.buffer = [...this.buffer, data];
    });
    this.processBuffer();
  }
  addWebsocket = ({ ws, ip }, symbol, view) => {
    this.removeWebsocket({ ws, ip }, null, view);
    this.openWebsockets = [...this.openWebsockets, { ws, ip, symbol, view }];
  };
  removeWebsocket = (
    connectionToRemove,
    symbolToRemove = null,
    view = null
  ) => {
    this.openWebsockets = this.openWebsockets.filter(
      (connection) =>
        connection.ip !== connectionToRemove.ip || // Keep other ips
        ((!view || connection.view === view) && // If no view specified, assume keep and look for symbol
          (!symbolToRemove || connection.symbol !== symbolToRemove)) // If no symbol specified, keep it and rely on view
    );
  };
  processBuffer = () => {
    const buffer = this.buffer;
    buffer.forEach(this.processEvent);
    this.buffer = [];
    setTimeout(() => this.processBuffer(), this.interval);
  };
  processEvent = (data) => {
    const parsedResponse = JSON.parse(data) || {};
    if (parsedResponse.type === "l2update") {
      this.openWebsockets
        .filter(
          ({ view, symbol }) =>
            view === Views.PRICE && symbol === parsedResponse.product_id
        )
        .forEach(({ ws }) =>
          ws.send(
            `Symbol ${
              parsedResponse.product_id
            }: ${parsedResponse.changes[0].join(", ")}`
          )
        );
    } else if (parsedResponse.type == "ticker") {
      this.openWebsockets
        .filter(
          ({ view, symbol }) =>
            view === Views.MATCHES && symbol === parsedResponse.product_id
        )
        .forEach(({ ws }) =>
          ws.send(
            `Timestamp: ${parsedResponse.time}, Symbol: ${parsedResponse.product_id}, Trade Size: ${parsedResponse.last_size}, Price: ${parsedResponse.price}`
          )
        );
    }
  };
}

export default Client;
