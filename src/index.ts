import Web3 from "web3";
const stringify = require("json-stable-stringify");
// @ts-ignore
import * as base64url from "base64url";

const HEADER = base64url.encode(
  stringify({
    type: "JWT",
    alg: "ETH"
  })
);

class EthWebToken {
  _web3: Web3;

  constructor(web3: Web3) {
    this._web3 = web3;
  }

  sign(address: string, payload: Object) {
    const checksumAddr = this._web3.utils.toChecksumAddress(address);
    const payloadStr = stringify({
      ...payload,
      address: checksumAddr
    });
    const payloadEncoded = base64url.encode(payloadStr);
    const sig = this._web3.eth.sign(
      checksumAddr,
      `${HEADER}.${payloadEncoded}`
    );
    return `${HEADER}.${payloadEncoded}.${base64url.encode(sig)}`;
  }

  decode(token: string) {
    const parts = token.split("\\.");
    return JSON.parse(base64url.decode(parts[1]));
  }

  verify(token: string) {
    const parts = token.split("\\.");
    const decoded = this.decode(token);
    const sig = base64url.decode(parts[2]);
    const addr = this._web3.eth.personal.ecRecover(
      `${parts[0]}.${parts[1]}`,
      sig
    );
    return decoded === addr;
  }
}

export default EthWebToken;
