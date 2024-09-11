import { useRef } from "react";
import { keyframes, styled } from "styled-components";

import { ArrowUpDownIcon, ButtonProps, IconButton } from "@pancakeswap/uikit";

const switchAnimation = keyframes`
  from {transform: rotate(0deg);}
  to {transform: rotate(180deg);}
  `;

const SwitchIconButtonV2 = styled(IconButton)`
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    .icon-up-down {
      display: block;
      fill: white;
    }
  }
`;
const ButtonWrapper = styled.div`
  will-change: transform;
  &.switch-animation {
    animation: ${switchAnimation} 0.25s forwards;
  }
`;

export const SwitchButtonV2 = (props: ButtonProps) => {
  const buttonWrapperRef = useRef<HTMLDivElement>(null);
  return (
    <ButtonWrapper
      ref={buttonWrapperRef}
      onClick={() => {
        if (!buttonWrapperRef.current?.classList.contains("switch-animation")) {
          buttonWrapperRef.current?.classList.add("switch-animation");
        }
      }}
      onAnimationEnd={() => {
        buttonWrapperRef.current?.classList.remove("switch-animation");
      }}
    >
      <SwitchIconButtonV2 variant="light" scale="sm" {...props}>
        <ArrowUpDownIcon className="icon-up-down" color="primary" />
      </SwitchIconButtonV2>
    </ButtonWrapper>
  );
};
