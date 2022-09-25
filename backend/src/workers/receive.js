const uws = require("uWebSockets.js");
const { convertResponseData, sendMessage } = require("../utils/tools");
const { servers } = require("../utils/variables");
let isDisableKeepAlive = false;

/**
 * 전체 서버에서 데이터 받을 수 있음
 */
const receiveSrever = uws
  .App({})
  .ws("/uws/*", {
    // properties
    idleTimeout: 32,
    maxBackpressure: 1024,
    maxPayloadLength: 1024, // 패킷 데이터 용량 (용량이 넘을 시 서버 끊김)
    compression: uws.DEDICATED_COMPRESSOR_3KB,

    // method
    open(ws) {
      if (isDisableKeepAlive) {
        ws.close();
      }
      servers.forEach((server) => {
        ws.subscribe(server);
      });
      ws.send("socket server loaded!");
    },
    message(ws, message, isBinary) {
      const data = convertResponseData(message, isBinary);
      const json = JSON.parse(data);
      console.log(json);
      const callback = (result) => {
        ws.send(JSON.stringify(result));
      };
      sendMessage(json.from, json, callback);
    },
    drain(ws) {
      console.log("WebSocket backpressure: ", ws.getBufferedAmount());
    },
    close(ws, code, message) {
      if (isDisableKeepAlive) {
        ws.unsubscribe(String(procId));
      }
    },
  })
  .any("/*", (res, req) => {
    res.writeHeader("Connection", true).writeStatus(200).end("test");
  })
  .listen(3000, (socket) => {
    if (socket) {
      process.send("ready");
      console.log(`server listening on ws://localhost:${3000}/uws/*`);
    }
  });

// 클라이언트 요청을 socket message로 받아
// sendMessage로 보내면 아래 메세지 이벤트로 받음
process.on("message", (packet) => {
  console.log(`[RECEIVE 서버에서 받은 패킷 메세지] : `, packet);
  process.send({
    type: "process:msg",
    data: {
      success: true,
    },
  });
});

// process dead
process.on("SIGINT", function () {
  isDisableKeepAlive = true;
  receiveSrever.close(function () {
    process.exit(0);
  });
});

module.exports = receiveSrever;
