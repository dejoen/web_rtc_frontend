import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 1. Core Next.js extension configurations
  ...compat.extends ('next/core-web-vitals', 'next/typescript'),

  // 2. Global application rule override block
  {
    rules: {
      // This explicitly turns off the explicit 'any' warning across the application
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // 3. Global path directory ignore configurations
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ],
  },
];


export default eslintConfig;
