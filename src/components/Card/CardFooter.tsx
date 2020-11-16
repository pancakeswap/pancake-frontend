import styled from "styled-components";
import { space, SpaceProps } from "styled-system";

const CardFooter = styled.div<SpaceProps>`
  border-top: 1px solid ${({ theme }) => theme.colors.borderColor};
  ${space}
`;

CardFooter.defaultProps = {
  p: "24px",
};

export default CardFooter;
