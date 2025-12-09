import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettierConfig,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/data/utils/api-client",
              message:
                "Direct API client imports are not allowed. Use repositories from @/data instead.",
            },
            {
              name: "@/data/internal",
              message:
                "Internal data layer exports are not allowed. Use repositories from @/data instead.",
            },
          ],
          patterns: [
            {
              group: ["@/data/utils/*", "@/data/api/*"],
              message:
                "Direct API imports are not allowed. Use repositories from @/data instead.",
            },
            {
              group: [
                "**/data/utils/**",
                "**/data/api/**",
                "**/data/schemas/**",
                "**/data/internal",
                "**/data/internal/**",
              ],
              message:
                "Internal data layer files cannot be imported directly. Use repositories from @/data instead.",
            },
          ],
        },
      ],
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/data/utils/api-client",
              message:
                "Direct API client imports are not allowed. Use repositories from @/data instead.",
            },
            {
              name: "@/data/internal",
              message:
                "Internal data layer exports are not allowed. Use repositories from @/data instead.",
            },
          ],
          patterns: [
            {
              group: ["@/data/utils/*", "@/data/api/*"],
              message:
                "Direct API imports are not allowed. Use repositories from @/data instead.",
            },
            {
              group: [
                "**/data/utils/**",
                "**/data/api/**",
                "**/data/schemas/**",
                "**/data/internal",
                "**/data/internal/**",
              ],
              message:
                "Internal data layer files cannot be imported directly. Use repositories from @/data instead.",
            },
          ],
        },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.name='fetch']",
          message:
            "Direct fetch calls are not allowed outside the data layer. Use repositories from @/data instead.",
        },
      ],
      // Unused variables should be errors, not warnings
      "no-unused-vars": "off", // Turn off base rule as it conflicts with TypeScript version
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  // Allow fetch calls inside the data layer (api-client.ts needs it)
  {
    files: ["src/data/**/*.ts", "src/data/**/*.tsx"],
    rules: {
      "no-restricted-syntax": "off",
    },
  },
  // Disable JSX in try/catch warning for Next.js server components
  // In server components, try/catch around async data fetching is the correct pattern
  {
    files: ["src/app/**/*.tsx", "src/app/**/*.ts"],
    rules: {
      "react-hooks/error-boundaries": "off",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
