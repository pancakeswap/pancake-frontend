import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => (
  <Svg viewBox="0 0 512 512" {...props}>
    <g>
      <path
        d="M195.047,75.844 H178.797 V109.047 H138.156 V320.344 H178.797 V360.297 H195.047 V320.344 H235.688 V109.047 H195.047 Z"
        stroke="currentColor"
      />
      <path
        d="M512,49.438 H471.375 V16.25 H455.109 V49.438 H414.469 V293.25 H455.109 V333.203 H471.375 V293.25 H512 Z"
        stroke="currentColor"
      />
      <path
        d="M56.875,203.172 H40.625 V239.75 H0 V459.172 H40.625 V495.75 H56.875 V459.172 H97.531 V239.75 H56.875 Z M81.281,256 V442.922 H16.25 V256 H81.281 Z"
        stroke="currentColor"
      />
      <path
        d="M333.203,151.703 H316.953 V184.891 H276.312 V412.453 H316.953 V452.406 H333.203 V412.453 H373.844 V184.891 H333.203 Z M357.594,201.156 V396.203 H292.563 V201.156 H357.594 Z"
        stroke="currentColor"
      />
    </g>
  </Svg>
);

export default Icon;
