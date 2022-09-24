const pm2 = require("pm2");
const { workers } = require("./variables");

const convertResponseData = (data, isBinary) => {
  if (isBinary) {
    const decoder = new TextDecoder();
    const decodedText = decoder.decode(data);
    const parsedData = decodedText
      .split(",")
      .map((bi) => String.fromCharCode(parseInt(Number(bi), 2)))
      .join("");
    return parsedData;
  }
  return data;
};

const sendMessage = (targetType, data) => {
  // console.log(workers.get(targetType));
  console.log(targetType);
  // console.log(workers);
  pm2.sendDataToProcessId(
    workers.get(targetType).pm_id,
    {
      type: "process:msg",
      data: data,
      topic: true,
    },
    (err, result) => {
      // console.log(err); // 없으면 null
      if (err) {
        console.log(err);
      } else {
        // 데이터 송신 한 결과
        console.log(`[packet to proc ${targetType}] : `, result);
      }
    }
  );
};

const startReceiveMessage = (name) => {
  pm2.launchBus(function (err, pm2_bus) {
    pm2_bus.on("process:msg", function (packet) {
      console.log(`[${name} :: received data] : `, packet);
    });
  });
};

module.exports = { convertResponseData, sendMessage, startReceiveMessage };
