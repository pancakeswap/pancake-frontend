import styled from "styled-components";
import { grid, flexbox } from "styled-system";
import { Box, BoxProps } from "./Box";

export const Grid = styled(Box)<BoxProps>`
  display: grid;
  ${flexbox}
  ${grid}
`;
