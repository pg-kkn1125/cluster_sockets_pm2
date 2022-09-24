const pm2 = require("pm2");
const { sendMessage, startReceiveMessage } = require("./utils/tools");
const { getWorkers } = require("./utils/variables");
const receiveSrever = require("./workers/receive");

// 각 워커의 process.send 데이터를 받음
startReceiveMessage("main");

// 워커 탐색
pm2.list((err, list) => {
  // console.log(err, list);
  process.send("ready");
  getWorkers(list);
  sendMessage("db", "test");

  pm2.restart("api", (err, proc) => {
    // Disconnects from PM2
    pm2.disconnect();
  });
});

process.on("message", function (packet) {
  console.log(`main packet`, packet);
  process.send({
    type: "process:msg",
    data: {
      success: true,
    },
  });
});
