import WebSocket from "ws";

class Client {
  ws = null;
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
    this.ws.on("message", function message(data) {
      const parsedResponse = JSON.parse(data) || {};
      // console.log("received from coinbase: %s", parsedResponse);
    });
  }
}

export default Client;
