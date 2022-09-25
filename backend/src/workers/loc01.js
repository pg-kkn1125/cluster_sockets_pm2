const { returnMsg, sendMessage } = require("../utils/tools");

// receive 서버에서 받는 곳
process.on("message", (packet) => {
  // process.on은 워커를 반환한다.
  console.log("[LOC01 서버에서 받은 패킷 메세지]: ", packet);
  if (packet.data.hasOwnProperty("to")) {
    sendMessage(packet.data.to, packet.data);
  } else {
    returnMsg(packet);
  }
});

process.send("ready");
