import { motion } from "framer-motion";
import { styled } from "styled-components";
import { flexbox } from "styled-system";
import Box from "./Box";
import { FlexProps } from "./types";

const Flex = styled(Box)<FlexProps>`
  display: flex;
  ${flexbox}
`;

export const MotionFlex = styled(motion.div)<FlexProps>`
  display: flex;
  ${flexbox}
`;

export default Flex;
