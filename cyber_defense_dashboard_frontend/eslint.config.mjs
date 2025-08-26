import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  js.configs.recommended,
  {
    ignores: [
      "node_modules/**",
      "build/",
      "dist/",
      "*.log",
      "*.tmp",
      "*.tsbuildinfo",
      "coverage/",
      ".vscode/",
      ".idea/",
      "*.config.mjs",
    ],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      // Your custom rules here
    },
  },
  {
    languageOptions: {
      globals: {
        // Browser globals used in the app
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        // Web Crypto API
        crypto: "readonly",
        // Vite define() injected build-time constants
        __APP_NAME__: "readonly",
        __SIM_ALERT_INTERVAL_MS__: "readonly",
        __SIM_METRICS_INTERVAL_MS__: "readonly",
        // Node-like process may appear in config files but not app source
        process: "readonly",
      },
    },
  },
];
