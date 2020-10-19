import styled, { DefaultTheme } from "styled-components";

export interface Props {
  color?: string;
  fontSize?: string;
  bold?: boolean;
}

interface ThemedProps extends Props {
  theme: DefaultTheme;
}

const getColor = ({ color, theme }: ThemedProps) => {
  return color || theme.colors.text;
};

const getFontSize = ({ fontSize }: Props) => {
  return fontSize || "16px";
};

const Text = styled.div<Props>`
  color: ${getColor};
  font-size: ${getFontSize};
  font-weight: ${({ bold }) => (bold ? 600 : 400)};
  line-height: 1.4;
`;

export default Text;
