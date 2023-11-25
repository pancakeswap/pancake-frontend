import React from "react";
import StyledProgress, { Bar } from "./StyledProgress";
import ProgressBunnyWrapper from "./ProgressBunnyWrapper";
import { ProgressBunny } from "../Svg";
import { ProgressProps, variants, scales } from "./types";

const stepGuard = (step: number) => {
  if (step < 0) {
    return 0;
  }

  if (step > 100) {
    return 100;
  }

  return step;
};

const Progress: React.FC<React.PropsWithChildren<ProgressProps>> = ({
  className,
  variant = variants.ROUND,
  scale = scales.MD,
  primaryStep = 0,
  secondaryStep = null,
  showProgressBunny = false,
  useDark = true,
  children,
}) => {
  return (
    <StyledProgress className={className} $useDark={useDark} variant={variant} scale={scale}>
      {children || (
        <>
          {showProgressBunny && (
            <ProgressBunnyWrapper style={{ left: `${stepGuard(primaryStep)}%` }}>
              <ProgressBunny />
            </ProgressBunnyWrapper>
          )}
          <Bar $useDark={useDark} primary style={{ width: `${stepGuard(primaryStep)}%` }} />
          {secondaryStep ? <Bar $useDark={useDark} style={{ width: `${stepGuard(secondaryStep)}%` }} /> : null}
        </>
      )}
    </StyledProgress>
  );
};

export default Progress;
