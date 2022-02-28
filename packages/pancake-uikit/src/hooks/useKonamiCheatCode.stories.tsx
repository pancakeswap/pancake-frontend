import React, { useCallback, useState } from "react";
import useKonamiCheatCode from "./useKonamiCheatCode";

export default {
  title: "Hooks/useKonamiCheatCode",
  argTypes: {},
};

export const Default: React.FC = () => {
  const [correctCodeEntered, setCorrectCodeEntered] = useState(false);
  const correctCodeHandler = useCallback(() => setCorrectCodeEntered(true), [setCorrectCodeEntered]);
  useKonamiCheatCode(correctCodeHandler);

  return (
    <div style={{ padding: "32px" }}>
      <div>Enter: ArrowUp, ArrowUp, ArrowDown, ArrowDown, ArrowLeft, ArrowRight, ArrowLeft, ArrowRight</div>
      <pre>Code Entered: {JSON.stringify(correctCodeEntered)}</pre>
    </div>
  );
};
