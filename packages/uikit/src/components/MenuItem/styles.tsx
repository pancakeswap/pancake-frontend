import styled from "styled-components";
import { StyledMenuItemProps } from "./types";

export const StyledMenuItemContainer = styled.div<StyledMenuItemProps>`
  position: relative;
  padding: 0 15px;

  @media screen and (max-width: 1500px) {
    padding: 0 6px;
  }

  ${({ $isActive, $variant, theme }) =>
    $isActive &&
    $variant === "subMenu" &&
    `
      &:after{
        content: "";
        position: absolute;
        bottom: 0;
        height: 4px;
        width: 100%;
        background-color: ${theme.colors.primary};
        border-radius: 2px 2px 0 0;
      }
    `};
`;

const StyledMenuItem = styled.a<StyledMenuItemProps>`
  position: relative;
  display: flex;
  align-items: center;

  color: white;
  font-size: 15px;
  font-weight: ${({ $isActive }) => ($isActive ? "600" : "400")};
  opacity: ${({ $isDisabled }) => ($isDisabled ? 0.5 : 1)};
  pointer-events: ${({ $isDisabled }) => ($isDisabled ? "none" : "inherit")};

  background-color: ${({ $isActive }) => ($isActive ? "#08060B" : "inherit")};
  border-radius: ${({ $isActive }) => ($isActive ? "30px" : "unset")};

  ${({ $statusColor, theme }) =>
    $statusColor &&
    `
    &:after {
      content: "";
      border-radius: 100%;
      background: ${theme.colors[$statusColor]};
      height: 8px;
      width: 8px;
      margin-left: 12px;
    }
  `}

  ${({ $variant }) =>
    $variant === "default"
      ? `
    padding: 0 21px;
    height: 33px;
  `
      : `
    padding-left: 4px;
    padding-right: 4px;

    height: 33px;
  `}

  &:hover {
    background: #08060b;
    border-radius: 30px;
  }

  @media screen and (max-width: 1380px) {
    padding: 0 8px;
  }

  .menu-icon {
    margin-right: 8px;
  }
`;

export default StyledMenuItem;
