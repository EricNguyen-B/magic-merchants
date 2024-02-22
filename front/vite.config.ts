import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default ({ mode }) => {
    process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ''));
    const port = process.env.VITE_REACT_PORT;
    const host = process.env.VITE_REACT_HOST;
    const protocal = process.env.VITE_REACT_PROTOCAL;
    console.log(`*********Listening to Server at: ${protocal}://${host}:${port}*********`);
    return defineConfig({
        plugins: [react(), eslint({ lintOnStart: true })],
        server: {
            proxy: {
                "/api": `${protocal}://${host}:${port}`,
            },
        },
    });
}
