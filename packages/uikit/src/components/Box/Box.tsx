/* eslint-disable no-restricted-syntax */
import { Box as BoxBase, BoxProps, MotionBox } from "@pancakeswap/ui";
import { forwardRef } from "react";

// re-export to avoid typescript union too complex
export const Box = forwardRef<HTMLElement, BoxProps>((props, ref) => <BoxBase ref={ref} {...props} />);

export { MotionBox };
export type { BoxProps };
