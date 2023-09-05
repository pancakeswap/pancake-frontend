import { styled } from "styled-components";
import { AutoColumn } from "../Column";

export const DynamicSection = styled(AutoColumn)<{ disabled?: boolean }>`
  opacity: ${({ disabled }) => (disabled ? "0.4" : "1")};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "initial")};
  width: 100%;
`;
