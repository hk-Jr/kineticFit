import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
});

// import { defineConfig } from "vite";
// import react from "@vitejs/react-refresh";

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     allowedHosts: [".ngrok-free.app"], // This allows ngrok to show your site
//   },
// });
