import styled from "styled-components";

export const SubMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 136px;
  background: ${({ theme }) => theme.colors.input};
  border-radius: ${({ theme }) => theme.radii.default};
  border: ${({ theme }) => `1px solid ${theme.colors.inputSecondary}`};
`;

export const ClickableElementContainer = styled.div`
  cursor: pointer;
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
