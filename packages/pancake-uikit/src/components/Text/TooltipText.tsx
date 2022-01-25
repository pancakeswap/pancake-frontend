import styled from "styled-components";
import Text from "./Text";

const TooltipText = styled(Text)`
  text-decoration: ${({ theme }) => `underline dotted ${theme.colors.textSubtle}`};
  text-underline-offset: 0.1em;
`;

export default TooltipText;
