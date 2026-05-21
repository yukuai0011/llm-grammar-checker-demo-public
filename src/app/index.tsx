import { Box } from "@/components/ui/box";
import { GrammarChecker } from "../components/GrammarChecker";

export default function Index() {
  return (
    <Box className="flex-1 bg-background-0 items-center pt-10">
      <GrammarChecker />
    </Box>
  );
}
