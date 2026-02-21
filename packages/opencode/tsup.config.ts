import { defineConfig } from "tsup";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sdkPath = path.resolve(
  __dirname,
  "node_modules/@opencode-ai/sdk/dist/src/index.js"
);

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  noExternal: ["@opencode-ai/sdk"],
  esbuildOptions(options) {
    options.alias = {
      ...options.alias,
      "@opencode-ai/sdk": sdkPath,
    };
  },
});
