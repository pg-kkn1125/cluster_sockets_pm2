class CustomException {
  static [500] = "서버에 문제가 발생했습니다.";
  static [422] = "데이터가 잘못되었습니다.";
  static [400] = "잘못된 요청입니다.";
  static [404] = "정보를 찾을 수 없습니다.";
  static [403] = "권한이 없습니다.";

  constructor({ ok, status, message }) {
    this.ok = ok;
    this.status = status;
    this.message = message;
  }

  toJson = () => ({ ok: this.ok, message: this.message });
}

const throwException = (errorNumber) => {
  throw new CustomException({
    ok: false,
    status: errorNumber,
    message: CustomException[errorNumber],
  });
};

module.exports = {
  CustomException,
  throwException,
};
