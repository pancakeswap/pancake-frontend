import React from "react";
import styled from "styled-components";
import Flex from "../Box/Flex";
import Box from "../Box/Box";
import { StatusProps, StepProps } from "./types";

const getStepNumberFontColor = ({ theme, status }: StatusProps) => {
  if (status === "past") {
    return theme.colors.success;
  }
  if (status === "current") {
    return theme.colors.invertedContrast;
  }
  return theme.colors.textDisabled;
};

const StyledStep = styled(Flex)`
  ${({ theme }) => theme.mediaQueries.md} {
    justify-content: center;
  }
`;

const Connector = styled.div<StatusProps>`
  position: absolute;
  width: 4px;
  height: calc(50% + 20px);
  ${({ $isFirstStep, $isLastStep, $isFirstPart }) => {
    if ($isFirstStep) return "top: 50%;";
    if ($isLastStep) return "top: 0;";
    return $isFirstPart ? "top:0;" : "top:50%;";
  }}
  left: calc(50% - 2px);
  background-color: ${({ theme, status }) =>
    theme.colors[status === "past" || status === "current" ? "success" : "textDisabled"]};
`;

const ChildrenWrapper = styled(Box)<{ isVisible: boolean }>`
  ${({ theme }) => theme.mediaQueries.md} {
    visibility: ${({ isVisible }) => (isVisible ? "visible" : "hidden")};
  }
`;

const ChildrenLeftWrapper = styled(ChildrenWrapper)`
  display: none;
  ${({ theme }) => theme.mediaQueries.md} {
    display: block;
    margin-right: 16px;
  }
`;

const ChildrenRightWrapper = styled(ChildrenWrapper)`
  margin-left: 8px;
  ${({ theme }) => theme.mediaQueries.md} {
    margin-left: 16px;
  }
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const StepNumber = styled.div<StatusProps>`
  box-shadow: 0px 1px 4px rgba(25, 19, 38, 0.15);
  background-color: ${({ theme, status }) => theme.colors[status === "current" ? "secondary" : "invertedContrast"]};
  border: 2px solid ${({ theme, status }) => (status === "past" ? theme.colors.success : "transparent")};
  border-radius: ${({ theme }) => theme.radii.circle};
  color: ${getStepNumberFontColor};
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 32px;
  width: 48px;
  height: 48px;
  z-index: 5;
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 40px;
    width: 80px;
    height: 80px;
  }
`;

/**
 * ChildrenLeftWrapper and ChildrenRightWrapper are used on the non mobile version, to force the alternate layout.
 * One of the child is hidden based on the step number.
 */
export const Step: React.FC<React.PropsWithChildren<StepProps>> = ({
  index,
  statusFirstPart,
  statusSecondPart,
  numberOfSteps = 0,
  children,
}) => {
  const isIndexPair = index % 2 === 0;
  const isFirst = index === 0;
  const isLast = index === numberOfSteps - 1;
  return (
    <StyledStep mb={index < numberOfSteps - 1 ? "16px" : 0}>
      <ChildrenLeftWrapper isVisible={!isIndexPair}>{children}</ChildrenLeftWrapper>
      <Wrapper>
        <StepNumber status={statusFirstPart}>{index + 1}</StepNumber>
        <Connector $isFirstStep={isFirst} $isLastStep={isLast} status={statusFirstPart} $isFirstPart />
        {!isFirst && !isLast && <Connector $isFirstStep={isFirst} $isLastStep={isLast} status={statusSecondPart} />}
      </Wrapper>
      <ChildrenRightWrapper isVisible={isIndexPair}>{children}</ChildrenRightWrapper>
    </StyledStep>
  );
};
