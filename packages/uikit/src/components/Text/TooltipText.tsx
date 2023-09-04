import { styled } from "styled-components";
import { Colors } from "../../theme/types";
import Text from "./Text";

const TooltipText = styled(Text)<{ decorationColor?: keyof Colors }>`
  text-decoration: underline dotted;
  text-decoration-color: ${({ theme, decorationColor }) =>
    `${theme?.colors && decorationColor ? theme.colors[decorationColor] : theme?.colors?.textSubtle}`};
  text-underline-offset: 0.1em;
`;

export default TooltipText;
