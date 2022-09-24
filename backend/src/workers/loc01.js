const { sendMessage } = require("../utils/tools");

// receive 서버에서 받는 곳
process.on("message", (packet) => {
  console.log("[loc01 packet]: ", packet);
  process.send({
    type: "process:msg",
    data: {
      from: packet.data.from,
      message: packet.data.message,
      success: true,
    },
  });
});

process.send("ready");
