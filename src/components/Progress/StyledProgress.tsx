import styled from "styled-components";
import { space, variant as StyledSystemVariant } from "styled-system";
import { styleVariants } from "./themes";
import { ProgressProps, variants } from "./types";

interface BarProps {
  primary?: boolean;
}

export const Bar = styled.div<BarProps>`
  position: absolute;
  top: 0;
  left: 0;
  background-color: ${(props) => (props.primary ? props.theme.colors.secondary : `${props.theme.colors.secondary}80`)};
  height: 16px;
  transition: width 200ms ease;
`;

Bar.defaultProps = {
  primary: false,
};

interface StyledProgressProps {
  variant: ProgressProps["variant"];
}

const StyledProgress = styled.div<StyledProgressProps>`
  position: relative;
  background-color: ${({ theme }) => theme.colors.input};
  box-shadow: ${({ theme }) => theme.shadows.inset};
  height: 16px;
  overflow: hidden;

  ${Bar} {
    border-top-left-radius: ${({ variant }) => (variant === variants.FLAT ? "0" : "32px")};
    border-bottom-left-radius: ${({ variant }) => (variant === variants.FLAT ? "0" : "32px")};
  }

  ${StyledSystemVariant({
    variants: styleVariants,
  })}
  ${space}
`;

export default StyledProgress;
