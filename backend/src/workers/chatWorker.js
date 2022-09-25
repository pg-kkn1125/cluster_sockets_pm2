const { returnMsg } = require("../utils/tools");

// sendMessage로 보내면 아래 메세지 이벤트로 받음
process.on("message", (packet) => {
  // process.on은 워커를 반환한다.
  console.log(`[CHAT 서버에서 받은 패킷 메세지] : `, packet);
  returnMsg(packet);
});

process.send("ready");
