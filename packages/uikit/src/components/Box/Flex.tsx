import { forwardRef } from "react";
import { Box, BoxProps } from "./Box";

export const Flex = forwardRef<HTMLElement, BoxProps>((props, ref) => <Box display="flex" ref={ref} {...props} />);

export type FlexProps = BoxProps;
