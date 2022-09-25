import { names } from "./socketPkg.js";

const board = document.querySelector("#board");
const box = document.querySelector(".box");

class Sockets {
  count = 0;
  connected = false;
  constructor(name, port) {
    this.socketname = name;
    this.port = port;
    this[name] = new WebSocket(`ws://localhost:${port}/uws/${name}`);
  }
  onopen = (e) => {
    if (this.count > 0) {
      console.log("[open] 재연결에 성공했습니다.");
    } else {
      console.log("[open]");
    }
    box.classList.add("active");
    this.connected = true;
  };
  onmessage = (e) => {
    console.log(`[${this.socketname} message]`, e);
    if (e.data instanceof Blob) {
      const reader = new FileReader();
      reader.readAsBinaryString(e.data);
      reader.onload = () => {
        console.log("result", reader.result);
        // 해석된 데이터 받음
        if (index > -1) {
          result.innerHTML = reader.result;
        } else {
          board.innerHTML = reader.result;
        }
      };
    } else {
      let json;
      let index = -1;
      if (e.data.startsWith("{")) {
        json = JSON.parse(e.data);
        // 서버로부터 데이터 뿌리는 부분
        if (json.data.data.hasOwnProperty("to")) {
          index = names.findIndex((value) => value === json.data.data.to);
        } else {
          index = names.findIndex((value) => value === json.data.data.from);
        }
      }
      if (index > -1) {
        const result = document
          .querySelector(`[data-num="${index + 1}"]`)
          .parentElement.querySelector(".result");
        result.innerHTML = "서버에서 받은 메세지 : " + e.data;
      } else {
        board.innerHTML = "서버에서 받은 메세지 : " + e.data;
      }
    }
  };
  onclose = (e) => {
    console.log("[close]");
    this.connected = false;
  };
  onerror = (e) => {
    console.log(e);
    this.connected = false;
    console.log("다시 연결을 시도합니다.");
    box.classList.remove("active");
    function retryConnect() {
      this[this.socketname] = new WebSocket(
        `ws://localhost:${this.port}/uws/${this.socketname}`
      );

      if (!this.connected && this.count < 10) {
        this.count++;
        console.log(`재 연결 시도 : ${this.count}`);
        setTimeout(() => retryConnect.bind(this), 1000);
      }
    }
    retryConnect.bind(this);
  };
  setupSocket() {
    const name = this.socketname;
    this[name].onopen = this.onopen;
    this[name].onmessage = this.onmessage;
    this[name].onclose = this.onclose;
    this[name].onerror = this.onerror;
  }
}

export default Sockets;
