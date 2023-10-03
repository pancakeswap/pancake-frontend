import { styled } from "styled-components";
import { Box, Flex } from "../Box";

export const InlineMenuContainer = styled(Box)`
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.radii.card};
  box-shadow: ${({ theme }) => theme.shadows.tooltip};
`;

export const SubMenuContainer = styled(Flex)`
  flex-direction: column;
  overflow: hidden;
  min-width: 136px;
  background: ${({ theme }) => theme.colors.input};
  border-radius: ${({ theme }) => theme.radii.default};
  border: ${({ theme }) => `1px solid ${theme.colors.inputSecondary}`};
`;

export const ClickableElementContainer = styled.div`
  cursor: pointer;
  display: inline-flex;
`;

export const SubMenuItem = styled.button`
  border: 0;
  outline: 0;
  cursor: pointer;
  background: transparent;
  padding: 8px 16px;
  color: ${({ theme }) => theme.colors.text};
  width: 100%;
  font-size: 16px;
  text-align: left;

  &:hover {
    background-color: ${({ theme }) => theme.colors.inputSecondary};
    text-decoration: none;
  }
`;
