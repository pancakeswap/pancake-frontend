import React from "react";
import styled, { DefaultTheme } from "styled-components";
import { CardRibbonProps } from "./types";

interface StyledCardRibbonProps extends CardRibbonProps {
  theme: DefaultTheme;
}

const StyledCardRibbon = styled.div<Partial<StyledCardRibbonProps>>`
  background-color: ${({ variantColor = "secondary", theme }) => theme.colors[variantColor]};
  color: white;
  margin: 0;
  padding: 0;
  padding: 8px 0;
  position: absolute;
  right: 0;
  top: 0;
  text-align: center;
  transform: translateX(30%) translateY(0%) rotate(45deg);
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

const CardRibbon: React.FC<CardRibbonProps> = ({ variantColor, text }) => {
  return (
    <StyledCardRibbon variantColor={variantColor}>
      <div title={text}>{text}</div>
    </StyledCardRibbon>
  );
};

export default CardRibbon;
