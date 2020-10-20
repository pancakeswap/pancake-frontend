import styled from "styled-components";
import Text from "../Text";

export interface Props {
  fontSize?: string;
  href: string;
}

const Link = styled(Text).attrs({ as: "a", bold: true })<Props>`
  color: ${({ theme }) => theme.colors.primary};
  &:hover {
    text-decoration: underline;
  }
`;

export default Link;
