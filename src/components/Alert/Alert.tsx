import React from "react";
import styled, { DefaultTheme } from "styled-components";
import CheckmarkCircleIcon from "../Svg/Icons/CheckmarkCircle";
import ErrorIcon from "../Svg/Icons/Error";
import BlockIcon from "../Svg/Icons/Block";
import InfoIcon from "../Svg/Icons/Info";
import { Text } from "../Text";
import { AlertProps, variants } from "./types";

interface ThemedIconLabel {
  variant: AlertProps["variant"];
  theme: DefaultTheme;
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
  background-color: ${getThemeColor};
  border-radius: 16px 0 0 16px;
  color: ${({ theme }) => theme.alert.background};
  padding: 8px;
  text-align: center;
  width: 40px;
`;

const Details = styled.div`
  background-color: ${({ theme }) => theme.alert.background};
  border-radius: 0 16px 16px 0;
  padding: 8px;
`;

const StyledAlert = styled.div`
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadows.level1};
  display: flex;

  ${Details} {
    flex: 1;
  }
`;

const Alert: React.FC<AlertProps> = ({ title, description, variant }) => {
  const Icon = getIcon(variant);

  return (
    <StyledAlert>
      <IconLabel variant={variant}>
        <Icon color="currentColor" width="20px" />
      </IconLabel>
      <Details>
        <Text bold>{title}</Text>
        {description && <Text as="p">{description}</Text>}
      </Details>
    </StyledAlert>
  );
};

export default Alert;
