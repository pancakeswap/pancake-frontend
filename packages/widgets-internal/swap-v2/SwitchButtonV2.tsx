import { useRef } from "react";
import { keyframes, styled } from "styled-components";

import { ArrowUpDownIcon, ButtonProps, IconButton } from "@pancakeswap/uikit";

const switchAnimation = keyframes`
  from {transform: rotate(0deg);}
  to {transform: rotate(180deg);}
  `;

const SwitchIconButtonV2 = styled(IconButton)`
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  width: 40px;
  height: 40px;
  border-radius: 20px;
  will-change: transform;
  transition: transform 0.25s ease-in-out;
  &:hover {
    opacity: 1 !important;
    transform: scale(1.1);
  }
`;
const ButtonWrapper = styled.div`
  will-change: transform;
  &.switch-animation {
    animation: ${switchAnimation} 0.25s forwards ease-in-out;
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
        <ArrowUpDownIcon className="icon-up-down" width={24} color="primary" />
      </SwitchIconButtonV2>
    </ButtonWrapper>
  );
};
