import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

interface LogoProps extends SvgProps {
  isDark: boolean;
}

const Logo: React.FC<LogoProps> = ({ isDark, ...props }) => {

  return (
    <Svg viewBox="0 0 1281 199" {...props}>
      <image width="1200" height="250" href={isDark ? '/images/logo-light.svg' : '/images/logo-dark.svg'}/>
    </Svg>
  );
};

export default React.memo(Logo, (prev, next) => prev.isDark === next.isDark);
