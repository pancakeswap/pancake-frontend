import { isValidElement, ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import EXTERNAL_LINK_PROPS from "../../util/externalLinkProps";
import { Box, BoxProps } from "../Box";
import * as styles from "./Button.css";

export interface BaseProps extends BoxProps {
  asChild?: boolean;
  external?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

export type ButtonProps = BaseProps & styles.Variants;

export const Button = (props: ButtonProps) => {
  const {
    startIcon,
    endIcon,
    external,
    className,
    isLoading = false,
    disabled,
    children,
    scale = "md",
    variant = "primary",
    as,
    asChild,
    ...rest
  } = props;
  const internalProps = external ? EXTERNAL_LINK_PROPS : {};
  const isDisabled = isLoading || disabled;

  const Comp = asChild ? Slot : as || "button";

  return (
    <Box
      asChild
      className={clsx(
        className,
        styles.variants({
          loading: isLoading,
          scale,
          variant,
        })
      )}
      disabled={isDisabled}
      {...internalProps}
      {...rest}
    >
      <Comp>
        {isValidElement(startIcon) && (
          <Box mr="0.5rem" asChild>
            {startIcon}
          </Box>
        )}
        {children}
        {isValidElement(endIcon) && (
          <Box ml="0.5rem" asChild>
            {endIcon}
          </Box>
        )}
      </Comp>
    </Box>
  );
};
