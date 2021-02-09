import styled from "styled-components";
import Text from "../Text/Text";
import { tags, sizes, HeadingProps } from "./types";

const style = {
  [sizes.MD]: {
    fontSize: "20px",
    fontSizeLg: "20px",
  },
  [sizes.LG]: {
    fontSize: "24px",
    fontSizeLg: "24px",
  },
  [sizes.XL]: {
    fontSize: "32px",
    fontSizeLg: "40px",
  },
  [sizes.XXL]: {
    fontSize: "48px",
    fontSizeLg: "64px",
  },
};

const Heading = styled(Text).attrs({ bold: true })<HeadingProps>`
  font-size: ${({ size }) => style[size || sizes.MD].fontSize};
  font-weight: 600;
  line-height: 1.1;

  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: ${({ size }) => style[size || sizes.MD].fontSizeLg};
  }
`;

Heading.defaultProps = {
  as: tags.H2,
};

export default Heading;
