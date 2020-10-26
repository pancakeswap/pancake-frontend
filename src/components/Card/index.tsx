import styled, { DefaultTheme } from "styled-components";

interface CardProps {
  isActive?: boolean;
  isSuccess?: boolean;
  isWarning?: boolean;
  theme: DefaultTheme;
}

/**
 * Priority: Warning --> Success --> Active
 */
const getBoxShadow = ({ isActive, isSuccess, isWarning, theme }: CardProps) => {
  if (isWarning) {
    return theme.card.boxShadowWarning;
  }

  if (isSuccess) {
    return theme.card.boxShadowSuccess;
  }

  if (isActive) {
    return theme.card.boxShadowActive;
  }

  return theme.card.boxShadow;
};

const Card = styled.div<CardProps>`
  background-color: ${({ theme }) => theme.card.background};
  border: ${({ theme }) => theme.card.boxShadow};
  border-radius: 32px;
  box-shadow: ${getBoxShadow};
  color: ${({ theme }) => theme.colors.text};
  padding: 24px;
`;

Card.defaultProps = {
  isActive: false,
  isSuccess: false,
  isWarning: false,
};

export default Card;
