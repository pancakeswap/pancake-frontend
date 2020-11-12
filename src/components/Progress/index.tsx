import React from "react";
import StyledProgress, { Bar } from "./StyledProgress";

export interface ProgressProps {
  step?: number;
}

const stepGuard = (step: number) => {
  if (step < 0) {
    return 0;
  }

  if (step > 100) {
    return 100;
  }

  return step;
};

const Progress: React.FC<ProgressProps> = ({ step = 0 }) => {
  return (
    <StyledProgress>
      <Bar style={{ width: `${stepGuard(step)}%` }} />
    </StyledProgress>
  );
};

export default Progress;
