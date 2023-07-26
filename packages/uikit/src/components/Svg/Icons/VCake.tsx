import React from "react";
import { useTheme } from "styled-components";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  const theme = useTheme();
  const primaryColor = theme.isDark ? "#372F47" : "#EEEAF4";
  const secondaryColor = theme.isDark ? "#B8ADD2" : "#7A6EAA";

  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="12" r="12" fill={primaryColor} />
      <g clipPath="url(#clip0_42_1099)">
        <path
          d="M11.56 14.0134C11.82 14.2734 12.24 14.2734 12.5 14.0134L16.74 9.77336C17 9.51336 17 9.09336 16.74 8.83336L13.44 5.53336C13.1867 5.26669 12.7667 5.26669 12.5067 5.52669L8.26 9.77336C8 10.0334 8 10.4534 8.26 10.7134L11.56 14.0134ZM12.9733 6.94003L15.3333 9.30003L12.0333 12.6L9.67333 10.24L12.9733 6.94003ZM17.6067 14.2734L16.1933 12.86C16.0733 12.74 15.9 12.6667 15.7267 12.6667H15.5467L14.2133 14H15.4867L16.6667 15.3334H7.33333L8.52 14H9.88667L8.55333 12.6667H8.27333C8.09333 12.6667 7.92667 12.74 7.8 12.86L6.38667 14.2734C6.14 14.5267 6 14.8667 6 15.22V17.3334C6 18.0667 6.6 18.6667 7.33333 18.6667H16.6667C17.4 18.6667 18 18.0734 18 17.3334V15.22C18 14.8667 17.86 14.5267 17.6067 14.2734Z"
          fill={secondaryColor}
        />
      </g>
    </Svg>
  );
};

export default Icon;
