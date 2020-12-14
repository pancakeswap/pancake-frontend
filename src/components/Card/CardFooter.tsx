import styled from "styled-components";
import { space, SpaceProps } from "styled-system";

export type CardFooterProps = SpaceProps;

const CardFooter = styled.div<CardFooterProps>`
  border-top: 1px solid ${({ theme }) => theme.colors.borderColor};
  ${space}
`;

CardFooter.defaultProps = {
  p: "24px",
};

export default CardFooter;
