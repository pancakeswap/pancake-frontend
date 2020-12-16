import styled from "styled-components";
import { space } from "styled-system";
import getThemeValue from "../../util/getThemeValue";
import { SvgProps } from "./types";

const Svg = styled.svg<SvgProps>`
  fill: ${({ theme, color }) => getThemeValue(`colors.${color}`, color)(theme)};
  ${space}
`;

Svg.defaultProps = {
  color: "text",
  width: "20px",
  xmlns: "http://www.w3.org/2000/svg",
};

export default Svg;
