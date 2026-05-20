import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "llm-grammar-checker",
  slug: "llm-grammar-checker",
  version: "1.0.0",
  web: {
    output: "static",
  },
  experiments: {
    baseUrl: "/llm-grammar-checker-demo-public",
  },
});
