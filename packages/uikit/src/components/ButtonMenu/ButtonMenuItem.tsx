import styled from "styled-components";
import { Button, ButtonProps } from "../Button/Button";
import { ButtonMenuItemProps } from "./types";

type InactiveButtonProps = ButtonProps & {
  forwardedAs: ButtonProps["as"];
};

const InactiveButton = styled(Button)<InactiveButtonProps>`
  background-color: transparent;
  color: ${({ theme, variant }) => (variant === "primary" ? theme.colors.primary : theme.colors.textSubtle)};
  &:hover:not(:disabled):not(:active) {
    background-color: transparent;
  }
`;

const ButtonMenuItem = ({ isActive = false, variant = "primary", as, ...props }: ButtonMenuItemProps) => {
  if (!isActive) {
    return <InactiveButton forwardedAs={as as any} variant={variant} {...props} />;
  }

  return <Button as={as as any} variant={variant} {...props} />;
};

export default ButtonMenuItem;
