import WebSocket from "ws";

// ws.on("error", console.error);

// ws.on("message", function message(data) {
//   console.log("received: %s", data);
// });

class Client {
  ws = null;
  constructor(symbols = ["BTC-USD", "ETH-USD", "XRP-USD", "LTC-USD"]) {
    this.ws = new WebSocket("wss://ws-feed.exchange.coinbase.com ");
    this.ws.on("open", () => {
      ws.send({
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
      });
    });
  }
}

export default Client;
