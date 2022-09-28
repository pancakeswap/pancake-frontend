import styled from "styled-components";
import { UserMenuItemProps } from "./types";

export const UserMenuDivider = styled.hr`
  border-color: ${({ theme }) => theme.colors.cardBorder};
  border-style: solid;
  border-width: 1px 0 0;
  margin: 4px 0;
`;

export const UserMenuItem = styled.button<UserMenuItemProps>`
  align-items: center;
  border: 0;
  background: transparent;
  color: ${({ theme, disabled }) => theme.colors[disabled ? "textDisabled" : "textSubtle"]};
  cursor: pointer;
  display: flex;
  font-size: 16px;
  height: 48px;
  justify-content: space-between;
  outline: 0;
  padding-left: 16px;
  padding-right: 16px;
  width: 100%;

  &:is(button) {
    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  }

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.tertiary};
  }

  &:active:not(:disabled) {
    opacity: 0.85;
    transform: translateY(1px);
  }
`;
