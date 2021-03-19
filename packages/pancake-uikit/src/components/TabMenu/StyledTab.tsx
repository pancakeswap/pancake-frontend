import styled from "styled-components";

interface StyledTabProps {
  color: "card" | "textSubtle";
  bgColor: "textSubtle" | "input";
}

const StyledTab = styled.button<StyledTabProps>`
  display: inline-flex;
  justify-content: center;
  cursor: pointer;
  border: 0;
  outline: 0;
  flex-grow: 1;
  padding: 8px;
  border-radius: 16px 16px 0 0;
  color: ${({ theme, color }) => theme.colors[color]};
  background-color: ${({ theme, bgColor }) => theme.colors[bgColor]};

  ${({ theme }) => theme.mediaQueries.md} {
    flex-grow: 0;
    padding: 8px 12px;
  }
`;

export default StyledTab;
