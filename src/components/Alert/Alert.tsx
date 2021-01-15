import React from "react";
import styled, { DefaultTheme } from "styled-components";
import CheckmarkCircleIcon from "../Svg/Icons/CheckmarkCircle";
import ErrorIcon from "../Svg/Icons/Error";
import BlockIcon from "../Svg/Icons/Block";
import InfoIcon from "../Svg/Icons/Info";
import { Text } from "../Text";
import { IconButton } from "../Button";
import { CloseIcon } from "../Svg";
import { Flex } from "../Flex";
import { AlertProps, variants } from "./types";

interface ThemedIconLabel {
  variant: AlertProps["variant"];
  theme: DefaultTheme;
  hasDescription: boolean;
}

const getThemeColor = ({ theme, variant = variants.INFO }: ThemedIconLabel) => {
  switch (variant) {
    case variants.DANGER:
      return theme.colors.failure;
    case variants.WARNING:
      return theme.colors.warning;
    case variants.SUCCESS:
      return theme.colors.success;
    case variants.INFO:
    default:
      return theme.colors.secondary;
  }
};

const getIcon = (variant: AlertProps["variant"] = variants.INFO) => {
  switch (variant) {
    case variants.DANGER:
      return BlockIcon;
    case variants.WARNING:
      return ErrorIcon;
    case variants.SUCCESS:
      return CheckmarkCircleIcon;
    case variants.INFO:
    default:
      return InfoIcon;
  }
};

const IconLabel = styled.div<ThemedIconLabel>`
  align-items: ${({ hasDescription }) => (hasDescription ? "start" : "center")};
  background-color: ${getThemeColor};
  border-radius: 16px 0 0 16px;
  color: ${({ theme }) => theme.alert.background};
  display: flex;
  flex: none;
  justify-content: center;
  min-height: 56px;
  padding: 12px;
`;

const Details = styled.div`
  flex: 1;
  padding: 12px;
`;

const CloseHandler = styled.div`
  border-radius: 0 16px 16px 0;
  padding: 12px 12px 12px 0;
`;

const StyledAlert = styled(Flex)<{ hasDescription: boolean }>`
  align-items: ${({ hasDescription }) => (hasDescription ? "stretch" : "center")};
  background-color: ${({ theme }) => theme.alert.background};
  border-radius: 16px;
  box-shadow: 0px 20px 36px -8px rgba(14, 14, 44, 0.1), 0px 1px 1px rgba(0, 0, 0, 0.05);
`;

const Alert: React.FC<AlertProps> = ({ title, description, variant, onClick }) => {
  const Icon = getIcon(variant);

  return (
    <StyledAlert hasDescription={!!description}>
      <IconLabel variant={variant} hasDescription={!!description}>
        <Icon color="currentColor" width="24px" />
      </IconLabel>
      <Details>
        <Text bold>{title}</Text>
        {description && <Text as="p">{description}</Text>}
      </Details>
      {onClick && (
        <CloseHandler>
          <IconButton size="sm" variant="text" onClick={onClick}>
            <CloseIcon width="24px" color="currentColor" />
          </IconButton>
        </CloseHandler>
      )}
    </StyledAlert>
  );
};

export default Alert;
