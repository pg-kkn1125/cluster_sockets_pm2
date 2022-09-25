const { returnMsg } = require("../utils/tools");

// receive 서버에서 받는 곳
process.on("message", (packet) => {
  // process.on은 워커를 반환한다.
  console.log("[LOC02 서버에서 받은 패킷 메세지]: ", packet);
  returnMsg(packet);
});

process.send("ready");
