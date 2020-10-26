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

export const StyledTag = styled.div<ThemedProps>`
  align-items: center;
  background-color: ${getTagVariantProp("background")};
  border-radius: 16px;
  color: ${getTagVariantProp("color")};
  display: inline-flex;
  font-size: 14px;
  font-weight: 400;
  height: 28px;
  line-height: 1.5;
  padding: 0 8px;
`;
