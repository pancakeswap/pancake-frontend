import { Box } from "@pancakeswap/uikit";
import styled from "styled-components";

export const GradientCard = styled(Box)`
  background: ${({ theme }) => theme.colors.gradientCardHeader};
  border-radius: ${({ theme }) => theme.radii.default};
`;

export const Divider = styled.hr`
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  width: 100%;
`;

export const TwoColumns = styled(Box)`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

export const LogoWrapper = styled(Box)`
  display: flex;
  width: 32px;
  height: 32px;
  justify-content: center;
  align-items: center;
  background: #280d5f;
  border-radius: 8px;
`;

export const GreyCard = styled(Box)`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.tertiary};
  border-radius: ${({ theme }) => theme.radii.default};
`;
