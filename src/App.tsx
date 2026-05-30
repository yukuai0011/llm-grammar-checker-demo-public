import { GrammarChecker } from "./components/GrammarChecker";

export function App() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center px-4 py-8">
      <GrammarChecker />
    </div>
  );
}
