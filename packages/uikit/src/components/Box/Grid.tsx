import { forwardRef } from "react";
import { Box, BoxProps } from "./Box";

export const Grid = forwardRef<HTMLElement, BoxProps>((props, ref) => <Box display="grid" ref={ref} {...props} />);
export type GridProps = BoxProps;
