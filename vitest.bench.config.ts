import codspeedPlugin from "@codspeed/vitest-plugin";
import { defineConfig, mergeConfig } from "vitest/config";
import baseConfig from "./vitest.config.ts";

// Performance benchmarks, measured continuously by CodSpeed in CI.
// Run locally with `pnpm bench`.
export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [codspeedPlugin()],
    test: {
      include: [],
      setupFiles: [],
      benchmark: {
        include: ["bench/**/*.bench.ts"],
      },
    },
  }),
);
