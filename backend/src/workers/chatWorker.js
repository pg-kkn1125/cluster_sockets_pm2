process.on("message", (packet) => {
  console.log(`[chat packet] : `, packet);
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
