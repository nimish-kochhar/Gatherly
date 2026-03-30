import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // ── Global ignores ──────────────────────────────────────────────
  { ignores: ["**/node_modules/", "**/dist/", "**/build/"] },

  // ── Base: JS recommended for all .js/.jsx/.mjs/.cjs files ──────
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },

  // ── Server: Node.js globals ────────────────────────────────────
  {
    files: ["server/**/*.js"],
    languageOptions: {
      globals: { ...globals.node },
    },
  },

  // ── Client: Browser globals + React ────────────────────────────
  {
    files: ["client/**/*.{js,jsx}"],
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: { ...globals.browser },
    },
    settings: { react: { version: "detect" } },
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  },
]);
