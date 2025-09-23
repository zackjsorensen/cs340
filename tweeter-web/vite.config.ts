import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import svgrPlugin from "vite-plugin-svgr";
import viteCommonJs from "vite-plugin-commonjs"
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteTsconfigPaths(), svgrPlugin(), viteCommonJs()],
  resolve: {
    alias: {
      // during development resolve tweeter-shared imports to local source
      "tweeter-shared": path.resolve(__dirname, "../tweeter-shared/src"),
      "tweeter-shared/": path.resolve(__dirname, "../tweeter-shared/src")
    }
  },
  server: {
    open: true,
  },
});
