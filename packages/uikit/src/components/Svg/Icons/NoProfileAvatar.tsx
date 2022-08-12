import React from "react";
import { useTheme } from "styled-components";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  const theme = useTheme();
  const primaryColor = theme.isDark ? "#3C3742" : "#e9eaeb";
  const secondaryColor = theme.isDark ? "#666171" : "#bdc2c4";

  return (
    <Svg viewBox="0 0 32 32" {...props}>
      <path d="M32 16c0 8.837-7.163 16-16 16S0 24.837 0 16 7.163 0 16 0s16 7.163 16 16z" fill={primaryColor} />
      <mask id="A" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
        <path d="M32 16c0 8.837-7.163 16-16 16S0 24.837 0 16 7.163 0 16 0s16 7.163 16 16z" fill="#c4c4c4" />
      </mask>
      <g mask="url(#A)">
        <path
          d="M25.128 16.436c0 3.115-4.133 5.641-9.231 5.641s-9.231-2.526-9.231-5.641V15h18.461v1.436zm2.205 13.806c0-3.815-5.074-6.908-11.333-6.908S4.667 26.426 4.667 30.242V32h22.667v-1.759z"
          fill={secondaryColor}
        />
        <path
          fillRule="evenodd"
          d="M10.234 5.601C9.942 4.264 10.96 3 12.328 3c1.184 0 2.143.959 2.143 2.143v3.873l1.427-.067c.589 0 1.166.034 1.724.098V5.143c0-1.184.959-2.143 2.143-2.143 1.368 0 2.386 1.264 2.093 2.601l-.931 4.258c2.529 1.006 4.201 2.749 4.201 4.731 0 3.115-4.133 5.641-9.231 5.641s-9.231-2.526-9.231-5.641c0-2.053 1.794-3.849 4.476-4.836l-.908-4.153z"
          fill={secondaryColor}
        />
        <ellipse cx="12.308" cy="14.846" rx="1.026" ry="1.538" fill={primaryColor} />
        <ellipse cx="19.385" cy="14.846" rx="1.026" ry="1.538" fill={primaryColor} />
      </g>
    </Svg>
  );
};

export default Icon;
