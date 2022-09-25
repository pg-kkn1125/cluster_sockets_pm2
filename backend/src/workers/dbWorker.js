const { returnMsg, sendMessage } = require("../utils/tools");
const sql = require("./mariadb/database/mariadb");
const userService = require("./mariadb/services/user.service");

// sendMessage로 보내면 아래 메세지 이벤트로 받음
process.on("message", (packet) => {
  // process.on은 워커를 반환한다.
  console.log(`[DB 서버에서 받은 패킷 메세지] : `, packet);
  if (packet.data.hasOwnProperty("to")) {
    sendMessage(packet.data.to, packet.data);
  } else if (packet.data?.query === "findAllUser") {
    userService.findAll(packet);
  } else {
    returnMsg(packet);
  }
});

process.send("ready");
