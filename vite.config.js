// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  // Specify the entry point if it's not index.html
  root: "./", // Adjust this based on your folder structure
  server: {
    open: true, // Automatically open the app in your browser
  },
});
