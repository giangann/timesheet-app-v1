import { ExpoRoot } from "expo-router";
import { useRouter } from "expo-router";

export default function App() {
  const context = require.context("./app");
  return <ExpoRoot context={context} />;
}
