import { DefaultTheme } from "styled-components";

export interface ThemedProps {
  theme: DefaultTheme;
}

export type Status = "past" | "current" | "future";

export interface StatusProps extends ThemedProps {
  theme: DefaultTheme;
  status?: Status;
  $isFirstStep?: boolean;
  $isLastStep?: boolean;
  $isFirstPart?: boolean;
}

export interface StepProps {
  index: number;
  statusFirstPart: Status;
  statusSecondPart?: Status;
  numberOfSteps?: number;
}
