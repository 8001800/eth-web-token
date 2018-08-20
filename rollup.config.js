import typescript from "rollup-plugin-typescript2";
import commonjs from "rollup-plugin-commonjs";

const pkg = require("./package.json");

export default {
  input: "./src/index.ts",
  output: [
    {
      file: pkg.main,
      name: "abacus-sdk-js",
      format: "umd",
      sourcemap: true
    },
    {
      file: pkg.module,
      format: "es",
      sourcemap: true
    }
  ],
  plugins: [typescript(), commonjs()]
};
