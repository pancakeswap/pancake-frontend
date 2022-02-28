import styled from "styled-components";
import { PolymorphicComponent } from "../../util/polymorphic";
import Button from "./Button";
import { BaseButtonProps } from "./types";

const IconButton: PolymorphicComponent<BaseButtonProps, "button"> = styled(Button)<BaseButtonProps>`
  padding: 0;
  width: ${({ scale }) => (scale === "sm" ? "32px" : "48px")};
`;

export default IconButton;
