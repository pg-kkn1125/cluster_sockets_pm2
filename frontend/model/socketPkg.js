import Sockets from "./Sockets.js";

export const names = [
  "receive",
  "loc01",
  "loc02",
  "loc03",
  "loc04",
  "loc05",
  "loc06",
  "loc07",
  "loc08",
  "loc09",
  "db",
  "chat",
];

const socketMap = {};

names
  .filter((_) => _)
  .forEach((name, idx) => {
    socketMap[name] = new Sockets(name, 3000);
    // console.log(socketMap[name]);
    socketMap[name].setupSocket();
  });

export default socketMap;
