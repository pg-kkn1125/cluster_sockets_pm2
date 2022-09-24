// sendMessage로 보내면 아래 메세지 이벤트로 받음
process.on("message", (packet) => {
  console.log(`[db packet] : `, packet);
  process.send({
    type: "process:msg",
    data: {
      message: "db 회신!",
    },
  });
});

process.send("ready");
