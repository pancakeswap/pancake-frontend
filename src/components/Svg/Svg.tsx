import { SVGAttributes } from "react";
import styled, { DefaultTheme } from "styled-components";
import { space, SpaceProps } from "styled-system";
import getThemeValue from "../../util/getThemeValue";

export interface Props extends SVGAttributes<HTMLOrSVGElement>, SpaceProps {
  theme: DefaultTheme;
}

const Svg = styled.svg.attrs({ xmlns: "http://www.w3.org/2000/svg" })<Props>`
  fill: ${({ theme, color }) => getThemeValue(`colors.${color}`, color)(theme)};
  ${space}
`;

Svg.defaultProps = {
  color: "text",
  width: "20px",
};

export default Svg;
