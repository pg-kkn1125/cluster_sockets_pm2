const pm2 = require("pm2");
const { workers, getWorkers } = require("./variables");

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

const sendMessage = (targetType, data, callback) => {
  pm2.list((err, list) => {
    getWorkers(list);
    console.log(`${targetType}로 보내는 시도 중`);
    if (workers.has(targetType)) {
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
            callback?.(result);
            // 데이터 송신 한 결과
            // console.log(
            //   `${
            //     result.data.data.from === "main" ? "main" : "cli"
            //   } >> 메인 >> ${targetType} | 패킷 결과 >> `,
            //   result
            // );
          }
        }
      );
    } else {
      pm2.sendDataToProcessId(
        1,
        {
          type: "process:msg",
          data: {
            from: targetType,
            message: "연결되지 않은 서버입니다.",
          },
          topic: true,
        },
        (err, result) => {
          // console.log(err); // 없으면 null
          if (err) {
            console.log(err);
          } else {
            callback?.(result);
            // 데이터 송신 한 결과
            // console.log(
            //   `${
            //     result.data.data.from === "main" ? "main" : "cli"
            //   } >> 메인 >> ${targetType} | 패킷 결과 >> `,
            //   result
            // );
          }
        }
      );
    }
  });
};

const startReceiveMessage = (name) => {
  pm2.launchBus(function (err, pm2_bus) {
    pm2_bus.on("process:msg", function (packet) {
      console.log(packet.hasOwnProperty("data") ? packet.data.from : "started");
      console.log(`${name}에서 받은 패킷 데이터 << `, packet);
    });
  });
};

function returnMsg(packet) {
  const isMain = packet.data.from === "main";
  if (isMain) {
    process.send(packet);
  } else {
    // 워커 탐색
    sendMessage("receive", packet.data);
  }
}

module.exports = {
  convertResponseData,
  sendMessage,
  startReceiveMessage,
  returnMsg,
};
