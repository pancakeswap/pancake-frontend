import React from "react";
import styled from "styled-components";
import { variant as systemVariant, space } from "styled-system";
import { WarningIcon, ErrorIcon } from "../Svg";
import { MessageProps } from "./types";
import variants from "./theme";

const Icons = {
  warning: WarningIcon,
  danger: ErrorIcon,
};

const MessageContainer = styled.div<MessageProps>`
  display: flex;
  background-color: gray;
  padding: 16px;
  border-radius: 16px;
  border: solid 1px;

  svg {
    align-self: flex-start;
  }

  ${space}
  ${systemVariant({
    variants,
  })}
`;

const Message: React.FC<MessageProps> = ({ children, variant, ...props }) => {
  const Icon = Icons[variant];
  return (
    <MessageContainer variant={variant} {...props}>
      <Icon color={variants[variant].borderColor} width="24px" mr="12px" style={{ alignSelf: "center" }} />
      {children}
    </MessageContainer>
  );
};

export default Message;
