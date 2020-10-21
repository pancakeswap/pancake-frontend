import styled, { DefaultTheme } from "styled-components";

interface CardProps {
  theme: DefaultTheme;
}

const Card = styled.div<CardProps>`
  background-color: ${({ theme }) => theme.card.background};
  border: ${({ theme }) => theme.card.boxShadow};
  border-radius: 32px;
  box-shadow: ${({ theme }) => theme.shadows.level1};
  color: ${({ theme }) => theme.colors.text};
  padding: 24px;
`;

export default Card;
