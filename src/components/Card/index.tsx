import styled, { DefaultTheme } from "styled-components";

interface CardProps {
  theme: DefaultTheme;
}

const Card = styled.div<CardProps>`
  background-color: ${({ theme }) => theme.colors.card.background};
  border: 1px solid ${({ theme }) => theme.colors.card.borderColor};
  border-radius: 32px;
  box-shadow: ${({ theme }) => theme.shadows.level1};
  color: ${({ theme }) => theme.colors.text};
  padding: 24px;
`;

export default Card;
