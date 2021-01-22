import styled, { css, keyframes } from "styled-components";
import { space } from "styled-system";
import getThemeValue from "../../util/getThemeValue";
import { SvgProps } from "./types";

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const spinStyle = css`
  animation: ${rotate} 2s linear infinite;
`;

const Svg = styled.svg<SvgProps>`
  fill: ${({ theme, color }) => getThemeValue(`colors.${color}`, color)(theme)};
  flex-shrink: 0;

  ${({ spin }) => spin && spinStyle}
  ${space}
`;

Svg.defaultProps = {
  color: "text",
  width: "20px",
  xmlns: "http://www.w3.org/2000/svg",
  spin: false,
};

export default Svg;
