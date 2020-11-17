import styled, { DefaultTheme } from "styled-components";
import { TagProps, TagThemeVariant, variants } from "./types";

interface ThemedProps extends TagProps {
  theme: DefaultTheme;
}

const InnerIcon = styled.span`
  align-items: center;
  display: inline-flex;
`;

export const StartIcon = styled(InnerIcon)`
  margin-right: 0.5em;
`;

export const EndIcon = styled(InnerIcon)`
  margin-left: 0.5em;
`;

const getTagVariantProp = (prop: keyof TagThemeVariant) => ({ theme, variant = variants.PURPLE }: ThemedProps) => {
  return theme.tag[variant][prop];
};

const getBackgroundColor = (props: ThemedProps) => {
  if (props.outline) {
    return "transparent";
  }

  return getTagVariantProp("background")(props);
};

const getColor = (props: ThemedProps) => {
  const { variant = variants.PURPLE, outline } = props;

  if (outline) {
    return props.theme.tag[variant].colorOutline;
  }

  return getTagVariantProp("color")(props);
};

const getBorder = (props: ThemedProps) => {
  const { variant = variants.PURPLE, theme, outline } = props;

  if (outline) {
    return `2px solid ${theme.tag[variant].borderColorOutline}`;
  }

  return "none";
};

export const StyledTag = styled.div<ThemedProps>`
  align-items: center;
  background-color: ${getBackgroundColor};
  border: ${getBorder};
  border-radius: 16px;
  color: ${getColor};
  display: inline-flex;
  font-size: 14px;
  font-weight: 400;
  height: 28px;
  line-height: 1.5;
  padding: 0 8px;
  svg {
    fill: ${getColor};
  }
`;
