import Web3 from "web3";
const stringify = require("json-stable-stringify");
// @ts-ignore
const base64url = require("base64url");

const HEADER = base64url.encode(
  stringify({
    type: "JWT",
    alg: "ETH"
  })
);

const encodeObj = (obj: Object) => base64url.encode(stringify(obj));
const decodeObj = (raw: string) => JSON.parse(base64url.decode(raw));

class EthWebToken {
  _web3: Web3;

  constructor(web3: Web3) {
    this._web3 = web3;
  }

  async sign(address: string, payload: Object) {
    const checksumAddr = this._web3.utils.toChecksumAddress(address);
    const payloadEncoded = encodeObj({
      ...payload,
      address: checksumAddr
    });
    const sig = await this._web3.eth.sign(
      `${HEADER}.${payloadEncoded}`,
      checksumAddr
    );
    return `${HEADER}.${payloadEncoded}.${base64url.encode(sig)}`;
  }

  decode(token: string) {
    return decodeObj(token.split(".")[1]);
  }

  async verify(token: string): Promise<boolean> {
    return (await this.decodeAndVerify(token)).valid;
  }

  async decodeAndVerify(
    token: string
  ): Promise<{
    valid: boolean;
    data: Object;
  }> {
    const parts = token.split(".");
    const decoded = decodeObj(parts[1]);
    const sig = base64url.decode(parts[2]);
    const addr = await this._web3.eth.personal.ecRecover(
      `${parts[0]}.${parts[1]}`,
      sig
    );
    return {
      // @ts-ignore
      valid: decoded.address === this._web3.utils.toChecksumAddress(addr),
      data: decoded
    };
  }
}

export default EthWebToken;
