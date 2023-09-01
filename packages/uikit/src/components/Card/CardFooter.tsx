import shouldForwardProp from "@styled-system/should-forward-prop";
import { styled } from "styled-components";
import { space, SpaceProps } from "styled-system";

export type CardFooterProps = SpaceProps;

const CardFooter = styled.div.withConfig({
  shouldForwardProp,
})<CardFooterProps>`
  border-top: 1px solid ${({ theme }) => theme.colors.cardBorder};
  ${space}
`;

CardFooter.defaultProps = {
  p: "24px",
};

export default CardFooter;
