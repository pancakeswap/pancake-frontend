import styled from "styled-components";
import { background, border, layout, position, space, color } from "styled-system";
import { BoxProps } from "./types";

const Box = styled.div<BoxProps>`
  ${background}
  ${border}
  ${layout}
  ${position}
  ${space}
  ${color}
`;

export default Box;
