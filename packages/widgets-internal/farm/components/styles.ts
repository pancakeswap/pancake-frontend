import { styled } from "styled-components";

export const Amount = styled.span<{ amount: number }>`
  color: ${({ amount, theme }) => (amount ? theme.colors.text : theme.colors.textDisabled)};
  display: flex;
  align-items: center;
`;
