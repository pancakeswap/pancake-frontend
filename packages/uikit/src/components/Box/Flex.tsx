import { styled } from "styled-components";
import { flexbox } from "styled-system";
import Box, { MotionBox } from "./Box";
import { FlexProps } from "./types";

const Flex = styled(Box)<FlexProps>`
  display: flex;
  ${flexbox}
`;

export const MotionFlex = styled(MotionBox)<FlexProps>`
  display: flex;
  ${flexbox}
`;

export default Flex;
