import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-plugin-prettier/recommended";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "import/order": [
        "error",
        {
          alphabetize: {
            caseInsensitive: true,
            order: "asc",
          },
          groups: ["builtin", "external", "internal"],
          "newlines-between": "always",
          pathGroups: [
            {
              group: "internal",
              pattern: "lib/**",
            },
            {
              group: "internal",
              pattern: "src/**",
            },
          ],
          pathGroupsExcludedImportTypes: [],
        },
      ],
      "no-shadow": "off",
      "sort-imports": [
        "error",
        { ignoreDeclarationSort: true, ignoreCase: true },
      ],
    },
  },
  prettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
