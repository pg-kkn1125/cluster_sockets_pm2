var cluster = require("cluster");
const numCPUs = require("os").cpus().length;

module.exports.create = function (options, callback) {
  if (cluster.isPrimary) {
    // fork child process for notif/sms/email worker
    global.dbWorker = require("child_process").fork("./dbWorker");
    global.chatWorker = require("child_process").fork("./chatWorker");
    global.receive = require("child_process").fork("./receive");

    // fork application workers
    for (var i = 0; i < numCPUs; i++) {
      var worker = cluster.fork().process;
      console.log("worker started. process id %s", worker.pid);
    }

    // if application worker gets disconnected, start new one.
    cluster.on("disconnect", function (worker) {
      console.error("Worker disconnect: " + worker.id);
      var newWorker = cluster.fork().process;
      console.log("Worker started. Process id %s", newWorker.pid);
    });

    cluster.on("online", function (worker) {
      console.log("New worker is online. worker: " + worker.id);
      // master receive messages and then forward it to worker based on type.
      worker.on("message", function (message) {
        switch (message.type) {
          case "sms":
            global.dbWorker.send(message);
            break;
          // each of these worker is listning to process.on('message')
          // and then perform relevant tasks.
          case "email":
            global.chatWorker.send(message);
            break;
          case "notif":
            global.notifWorker.send(message);
            break;
        }
      });
    });
  } else {
    global.dbWorker = {
      send: function (message) {
        message.type = "sms";
        process.send(message); // send message to master
        console.log("db Message sent from worker.");
      },
    };
    global.chatWorker = {
      send: function (message) {
        message.type = "email";
        process.send(message); // send message to master
        console.log("chat Message sent from worker.");
      },
    };

    global.receive = {
      send: function (message) {
        message.type = "notif";
        process.send(message); // send message to master
        console.log("receive Message sent from worker.");
      },
    };
    callback(cluster);
  }
};
