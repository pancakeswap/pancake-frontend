import React from "react";
import styled, { DefaultTheme } from "styled-components";
import { CardRibbonProps } from "./types";

interface StyledCardRibbonProps extends CardRibbonProps {
  theme: DefaultTheme;
}

const StyledCardRibbon = styled.div<Partial<StyledCardRibbonProps>>`
  z-index: ${({ theme }) => theme.zIndices.ribbon};
  background-color: ${({ variantColor = "secondary", theme }) => theme.colors[variantColor]};
  color: white;
  margin: 0;
  padding: 0;
  padding: 8px 0;
  position: absolute;
  right: ${({ ribbonPosition }) => (ribbonPosition === "right" ? 0 : "auto")};
  top: 0;
  text-align: center;
  transform: translateX(30%) translateY(0%) rotate(45deg);
  transform: ${({ ribbonPosition }) =>
    ribbonPosition === "right"
      ? "translateX(30%) translateY(0%) rotate(45deg)"
      : "translateX(0%) translateY(200%) rotate(-45deg)"};
  transform-origin: top left;
  width: 96px;

  &:before,
  &:after {
    background-color: ${({ variantColor = "secondary", theme }) => theme.colors[variantColor]};
    content: "";
    height: 100%;
    margin: 0 -1px; /* Removes tiny gap */
    position: absolute;
    top: 0;
    width: 100%;
  }

  &:before {
    right: 100%;
  }

  &:after {
    left: 100%;
  }

  & > div {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 96px;
  }
`;

const CardRibbon: React.FC<CardRibbonProps> = ({ variantColor, text, ribbonPosition, ...props }) => {
  return (
    <StyledCardRibbon variantColor={variantColor} ribbonPosition={ribbonPosition} {...props}>
      <div title={text}>{text}</div>
    </StyledCardRibbon>
  );
};

CardRibbon.defaultProps = {
  // eslint-disable-next-line react/default-props-match-prop-types
  ribbonPosition: "right",
};

export default CardRibbon;
