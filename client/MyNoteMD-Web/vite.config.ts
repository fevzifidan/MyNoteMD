import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import fs from 'fs'

// Load .ai.env file manually and inject into import.meta.env
const getAiEnv = () => {
  const envPath = path.resolve(__dirname, '.ai.env');
  if (!fs.existsSync(envPath)) return {};

  const content = fs.readFileSync(envPath, 'utf-8');
  const env: Record<string, string> = {};
  content.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) return;

    const [key, ...valueParts] = trimmedLine.split('=');
    if (key && valueParts.length > 0) {
      env[`import.meta.env.${key.trim()}`] = JSON.stringify(valueParts.join('=').trim());
    }
  });
  return env;
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: getAiEnv(),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
