import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: [
      "tests/e2e/**",
      "playwright-report/**",
      "test-results/**",
      ".next/**",
    ],
  },
];

export default eslintConfig;
