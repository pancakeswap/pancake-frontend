import { styled } from "styled-components";
import { PolymorphicComponent } from "../../util/polymorphic";
import Button from "./Button";
import { BaseButtonProps } from "./types";

const IconButton: PolymorphicComponent<BaseButtonProps, "button"> = styled(Button)<BaseButtonProps>`
  padding: 2px;
  // width: ${({ scale }) => (scale === "xs" ? "auto" : scale === "sm" ? "32px" : "48px")};
  opacity: 0.65;
  &:hover {
    opacity: 1 !important;
  }
`;

export default IconButton;
