import { styled } from "styled-components";
import { flexbox, grid } from "styled-system";
import Box, { MotionBox } from "./Box";
import { GridProps } from "./types";

const Grid = styled(Box)<GridProps>`
  display: grid;
  ${flexbox}
  ${grid}
`;

export const MotionGrid = styled(MotionBox)<GridProps>`
  display: grid;
  ${flexbox}
  ${grid}
`;

export default Grid;
