import socketpkg, { names } from "./model/socketPkg.js";

const btn1 = document.querySelector("#btn1");
const btn2 = document.querySelector("#btn2");
const btn3 = document.querySelector("#btn3");
const btn4 = document.querySelector("#btn4");
const btn5 = document.querySelector("#btn5");
const btn6 = document.querySelector("#btn6");
const btn7 = document.querySelector("#btn7");
const btn8 = document.querySelector("#btn8");
const btn9 = document.querySelector("#btn9");
const btn10 = document.querySelector("#btn10");
const btn11 = document.querySelector("#btn11");
const btn12 = document.querySelector("#btn12");

const ltoc = document.querySelector("#ltoc");

const encodeData = (data) => {
  const jsonData = JSON.stringify(data);
  const binaryData = jsonData
    .split("")
    .map((json) => json.charCodeAt(0).toString(2));
  const encoder = new TextEncoder();
  return encoder.encode(binaryData);
};

const handleSendServer = (e) => {
  const num = e.target.dataset.num;
  const data = {
    from: names[num - 1],
    data: { name: "kimson", age: 25, gender: 1 },
  };
  const encodedBinaryData = encodeData(data);
  const socketname = names[num - 1];
  socketpkg[socketname][socketname].send(encodedBinaryData);
};

[btn1, btn2, btn3, btn4, btn5, btn6, btn7, btn8, btn9, btn10, btn11, btn12]
  .filter((_) => _)
  .forEach((bn) => {
    bn.addEventListener("click", handleSendServer);
  });

ltoc.addEventListener("click", (e) => {
  const num = e.target.dataset.from;
  const data = {
    from: names[num - 1],
    data: {
      name: "kimson",
      age: 25,
      gender: 1,
    },
    to: names[11],
  };
  const encodedBinaryData = encodeData(data);
  const socketname = names[num - 1];
  socketpkg[socketname][socketname].send(encodedBinaryData);
});
