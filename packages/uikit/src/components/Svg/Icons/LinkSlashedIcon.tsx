import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

export const LinkSlashedIcon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 17 16" {...props}>
      <g>
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M13.1345 9.71895L14.6223 11.2564L14.7449 11.1963C15.441 10.8551 15.9925 10.3552 16.3956 9.69918C16.7984 9.04377 17 8.32556 17 7.54853C17 6.41736 16.5992 5.44763 15.8016 4.64999C15.004 3.85235 14.0342 3.45155 12.9031 3.45155H10.5575C10.2887 3.45155 10.0545 3.54451 9.86769 3.73129C9.68091 3.91808 9.58794 4.15228 9.58794 4.42106C9.58794 4.68984 9.68091 4.92404 9.86769 5.11083C10.0545 5.29761 10.2887 5.39057 10.5575 5.39057H12.9031C13.5054 5.39057 14.0113 5.59925 14.4318 6.01975C14.8523 6.44025 15.061 6.94617 15.061 7.54853C15.061 8.0555 14.9112 8.49281 14.613 8.86855C14.3128 9.24679 13.9238 9.50187 13.4397 9.63501L13.1345 9.71895ZM9.98716 6.57901L11.8077 8.39956L11.9371 8.30717C12.0542 8.22351 12.1456 8.11478 12.2108 7.98428C12.2775 7.85104 12.3088 7.70449 12.3088 7.54853C12.3088 7.27974 12.2159 7.04554 12.0291 6.85876C11.8423 6.67197 11.6081 6.57901 11.3393 6.57901H9.98716ZM1.8479 5.02908C2.17696 4.606 2.56101 4.26554 2.99903 4.00843L1.12056 2.12996C0.938588 1.94799 0.850586 1.71618 0.850586 1.44997C0.850586 1.18376 0.938588 0.951946 1.12056 0.769974C1.30253 0.588002 1.53434 0.5 1.80055 0.5C2.06677 0.5 2.29858 0.588002 2.48055 0.769974L15.7723 14.0617C15.9543 14.2437 16.0423 14.4755 16.0423 14.7417C16.0423 15.0079 15.9543 15.2397 15.7723 15.4217C15.5903 15.6037 15.3585 15.6917 15.0923 15.6917C14.8261 15.6917 14.5943 15.6037 14.4123 15.4217L7.50864 8.51804H6.64813C6.37934 8.51804 6.14514 8.42508 5.95836 8.23829C5.77157 8.05151 5.67861 7.81731 5.67861 7.54853C5.67861 7.30621 5.75417 7.092 5.90591 6.91531L4.4643 5.4737C4.12497 5.5706 3.82302 5.75234 3.55561 6.01975C3.13512 6.44025 2.92644 6.94617 2.92644 7.54853C2.92644 8.15088 3.13512 8.65681 3.55561 9.07731C3.97611 9.4978 4.48204 9.70648 5.08439 9.70648H7.42999C7.69878 9.70648 7.93297 9.79944 8.11976 9.98622C8.30655 10.173 8.39951 10.4072 8.39951 10.676C8.39951 10.9448 8.30655 11.179 8.11976 11.3658C7.93297 11.5525 7.69878 11.6455 7.42999 11.6455H5.08439C3.95323 11.6455 2.98349 11.2447 2.18585 10.4471C1.38821 9.64943 0.987413 8.67969 0.987413 7.54853C0.987413 6.60804 1.27474 5.76601 1.8479 5.02908ZM14.6623 11.0278L14.6623 11.0278C15.3268 10.7021 15.8513 10.2264 16.2358 9.60093C16.6202 8.97543 16.8124 8.2913 16.8124 7.54853C16.8124 6.46694 16.4312 5.54499 15.6689 4.78267C14.9066 4.02035 13.9846 3.63919 12.9031 3.63919H10.5575C10.5298 3.63919 10.5026 3.64036 10.4761 3.64271C10.5026 3.64037 10.5297 3.63921 10.5574 3.63921H12.903C13.9846 3.63921 14.9065 4.02037 15.6689 4.78269C16.4312 5.545 16.8123 6.46696 16.8123 7.54854C16.8123 8.29131 16.6201 8.97544 16.2357 9.60094C15.8513 10.2264 15.3268 10.702 14.6623 11.0278ZM11.8964 6.99145C11.7465 6.84159 11.5609 6.76666 11.3393 6.76666H10.4402L10.4402 6.76667H11.3393C11.5608 6.76667 11.7465 6.8416 11.8964 6.99146C12.0462 7.14132 12.1211 7.32701 12.1211 7.54854C12.1211 7.67885 12.0951 7.79613 12.043 7.90038C11.9908 8.00461 11.9192 8.08931 11.828 8.15446L11.828 8.15447C11.9192 8.08932 11.9909 8.00461 12.043 7.90037C12.0951 7.79612 12.1212 7.67884 12.1212 7.54853C12.1212 7.327 12.0463 7.1413 11.8964 6.99145Z"
          fill={props.color || "white"}
        />
      </g>
    </Svg>
  );
};

export default LinkSlashedIcon;
