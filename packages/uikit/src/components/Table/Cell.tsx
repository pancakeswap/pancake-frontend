import { styled } from "styled-components";
import { typography, TypographyProps } from "styled-system";

export const Td = styled.td<TypographyProps>`
  color: ${({ theme }) => theme.colors.text};
  padding: 16px;
  vertical-align: middle;

  ${typography}
`;

export const Th = styled(Td).attrs({ as: "th" })<TypographyProps>`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 12px;
  text-transform: uppercase;
  white-space: nowrap;

  ${typography}
`;
