import shouldForwardProp from "@styled-system/should-forward-prop";
import { m as motion, Variants } from "framer-motion";
import { styled } from "styled-components";
import { background, border, color, layout, position, space } from "styled-system";
import { BoxProps } from "./types";

export { domAnimation, type AnimatePresence as AnimatePresenceType, type LazyMotion } from "framer-motion";
export type MotionVariants = Variants;

export const MotionBox = styled(motion.div).withConfig({})<BoxProps>`
  ${background}
  ${border}
  ${layout}
  ${position}
  ${space}
`;

const Box = styled.div.withConfig({
  shouldForwardProp,
})<BoxProps>`
  ${background}
  ${border}
  ${layout}
  ${position}
  ${space}
  ${color}
`;

export default Box;
