import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    resolveAlias: {
      // Workaround: @opencode-ai/sdk@1.2.9 exports ./dist/index.js but actual file is dist/src/index.js
      "@opencode-ai/sdk": path.resolve(
        __dirname,
        "node_modules/@opencode-ai/sdk/dist/src/index.js"
      ),
    },
  },
};

export default nextConfig;
