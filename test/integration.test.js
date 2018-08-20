const EthWebToken = require("../");
const Web3 = require("web3");
const stringify = require("json-stable-stringify");
// @ts-ignore
const base64url = require("base64url");

const ewt = new EthWebToken(
  new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
);

const ETH_ADDRESS = process.env.ETH_ADDRESS;
if (!ETH_ADDRESS) {
  throw new Error("Must specify ETH_ADDRESS.");
}

async function main() {
  try {
    const token = await ewt.sign(ETH_ADDRESS, {
      hello: "world"
    });
    console.log(token);

    const verify = await ewt.verify(token);
    console.log(verify, "should be true");

    // make a bad EWT
    const parts = token.split(".");
    const fakeAddr = ETH_ADDRESS.slice(0, ETH_ADDRESS.length - 8) + "abcdabcd";
    parts[1] = base64url.encode(
      stringify({ ...ewt.decode(token), address: fakeAddr })
    );
    const badToken = parts.join(".");

    const verifyBad = await ewt.verify(badToken);
    console.log(verifyBad, "should be false");
  } catch (e) {
    console.error(e);
  }
}

main();
