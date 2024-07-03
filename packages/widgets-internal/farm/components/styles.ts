import { styled } from "styled-components";

export const Amount = styled.span<{ amount: number }>`
  color: ${({ amount, theme }) => (amount ? theme.colors.primary : theme.colors.textDisabled)};
  display: flex;
  align-items: center;
`;
