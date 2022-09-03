/* eslint-disable no-restricted-syntax */
import { m as motion } from "framer-motion";
import { forwardRef } from "react";
import { Box, BoxProps } from "@pancakeswap/ui";

export { Box };

export type { BoxProps };

export const MotionBox = forwardRef<HTMLElement, BoxProps>((props, ref) => (
  <Box ref={ref} as={motion.div} {...props} />
));
