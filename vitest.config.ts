import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    // tsconfig의 "@/*" → "src/*" 경로 별칭과 동일하게 맞춘다
    alias: { "@": path.resolve(__dirname, "src") },
  },
  test: {
    include: ["src/**/*.test.ts"],
  },
});
