import styled from "styled-components";
import { AnchorHTMLAttributes } from "react";
import Text from "../Text";

const Link = styled(Text).attrs({ as: "a", bold: true })<AnchorHTMLAttributes<HTMLAnchorElement>>`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
  width: fit-content;
  &:hover {
    text-decoration: underline;
  }
`;

export default Link;
