import styled from "styled-components";
import { background, border, layout, position, space, backgroundColor } from "styled-system";
import { BoxProps } from "./types";

const Box = styled.div<BoxProps>`
  ${background}
  ${border}
  ${layout}
  ${position}
  ${space}
  ${backgroundColor}
`;

export default Box;
