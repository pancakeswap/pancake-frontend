import { useState, useEffect } from "react";
import { styled, keyframes } from "styled-components";
import { Flex, ArrowDownIcon } from "@pancakeswap/uikit";

const rotate = keyframes`
  0% {
    transform: scale(1);
    stroke-width: 0;
  }
  50% {
    transform: scale(1.3);
    stroke-width: 2;
  }
  100% {
    transform: scale(1);
    stroke-width: 0;
  }
`;

const ArrowContainer = styled(Flex)`
  & > svg {
    animation: 0.2s ${rotate} linear;
    stroke: ${({ theme }) => `${theme.colors.primary3D}`};
    stroke-width: 0;
  }
`;

interface AnimatedArrowProps {
  state?: any;
}

export const AnimatedArrow: React.FC<React.PropsWithChildren<AnimatedArrowProps>> = ({ state }) => {
  const [key, setKey] = useState("roiArrow-0");

  // Trigger animation on state change
  useEffect(() => {
    setKey((prevKey) => {
      const prevId = parseInt(prevKey.split("-")[1], 10);
      return `roiArrow-${prevId + 1}`;
    });
  }, [state]);

  return (
    <ArrowContainer justifyContent="center" my="24px" key={key}>
      <ArrowDownIcon width="24px" height="24px" color="textSubtle" />
    </ArrowContainer>
  );
};
