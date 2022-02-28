import { InputHTMLAttributes } from "react";
import styled from "styled-components";
import Text from "../Text/Text";

interface SliderLabelProps {
  progress: string;
}

interface StyledInputProps extends InputHTMLAttributes<HTMLInputElement> {
  isMax: boolean;
}

interface DisabledProp {
  disabled?: boolean;
}

const getCursorStyle = ({ disabled = false }: DisabledProp) => {
  return disabled ? "not-allowed" : "cursor";
};

const bunnyHeadMax = `"data:image/svg+xml,%3Csvg width='24' height='32' viewBox='0 0 28 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='1' y='19' width='17' height='11' fill='%231FC7D4'/%3E%3Cpath d='M9.507 24.706C8.14635 26.0666 9.73795 28.2313 11.7555 30.2489C13.7731 32.2665 15.9378 33.8581 17.2984 32.4974C18.6591 31.1368 17.9685 28.0711 15.9509 26.0535C13.9333 24.0359 10.8676 23.3453 9.507 24.706Z' fill='%231FC7D4'/%3E%3Cpath d='M15.507 22.706C14.1463 24.0666 15.7379 26.2313 17.7555 28.2489C19.7731 30.2665 21.9378 31.8581 23.2984 30.4974C24.6591 29.1368 23.9685 26.0711 21.9509 24.0535C19.9333 22.0359 16.8676 21.3453 15.507 22.706Z' fill='%231FC7D4'/%3E%3Cg filter='url(%23filter0_d)'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M14.146 6.75159C14.2105 7.10896 14.2703 7.48131 14.3281 7.86164C14.2189 7.85865 14.1095 7.85714 14 7.85714C13.3803 7.85714 12.7648 7.90539 12.159 7.99779C11.879 7.41458 11.5547 6.82246 11.1872 6.23145C8.69897 2.22947 6.53826 1.98679 4.67882 2.98366C2.81938 3.98052 2.85628 6.67644 5.26696 9.40538C5.58076 9.76061 5.90097 10.1398 6.2247 10.5286C3.69013 12.4659 2 15.2644 2 18.2695C2 23.8292 7.78518 25 14 25C20.2148 25 26 23.8292 26 18.2695C26 14.8658 23.8318 11.7272 20.7243 9.80476C20.9022 8.86044 21 7.83019 21 6.75159C21 2.19612 19.2549 1 17.1022 1C14.9495 1 13.5261 3.31847 14.146 6.75159Z' fill='url(%23paint0_linear_bunnyhead_max)'/%3E%3C/g%3E%3Cpath d='M11.5047 16.0634C10.9435 14.4456 8.79685 14.4456 8.08131 16.0635' stroke='%23452A7A' stroke-linecap='round'/%3E%3Cpath d='M20.8894 16.0634C20.3283 14.4456 18.1816 14.4456 17.4661 16.0635' stroke='%23452A7A' stroke-linecap='round'/%3E%3Cpath d='M14.7284 17.4446C14.796 18.3149 14.4446 20.0556 12.498 20.0556' stroke='%23452A7A' stroke-linecap='round'/%3E%3Cpath d='M14.7457 17.4446C14.6781 18.3149 15.0296 20.0556 16.9761 20.0556' stroke='%23452A7A' stroke-linecap='round'/%3E%3Cpath d='M13.4505 20.0787C13.4505 21.5097 15.955 21.5097 15.955 20.0787' stroke='%23452A7A' stroke-linecap='round'/%3E%3Cdefs%3E%3Cfilter id='filter0_d' x='0' y='0' width='28' height='28' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'/%3E%3CfeOffset dy='1'/%3E%3CfeGaussianBlur stdDeviation='1'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0'/%3E%3CfeBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow'/%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow' result='shape'/%3E%3C/filter%3E%3ClinearGradient id='paint0_linear_bunnyhead_max' x1='14' y1='1' x2='14' y2='25' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%2353DEE9'/%3E%3Cstop offset='1' stop-color='%231FC7D4'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E%0A"`;
const bunnyHeadMain = `"data:image/svg+xml,%3Csvg width='24' height='32' viewBox='0 0 28 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='1' y='19' width='17' height='11' fill='%231FC7D4'/%3E%3Cpath d='M9.507 24.706C8.14635 26.0666 9.73795 28.2313 11.7555 30.2489C13.7731 32.2665 15.9378 33.8581 17.2984 32.4974C18.6591 31.1368 17.9685 28.0711 15.9509 26.0535C13.9333 24.0359 10.8676 23.3453 9.507 24.706Z' fill='%231FC7D4'/%3E%3Cpath d='M15.507 22.706C14.1463 24.0666 15.7379 26.2313 17.7555 28.2489C19.7731 30.2665 21.9378 31.8581 23.2984 30.4974C24.6591 29.1368 23.9685 26.0711 21.9509 24.0535C19.9333 22.0359 16.8676 21.3453 15.507 22.706Z' fill='%231FC7D4'/%3E%3Cg filter='url(%23filter0_d)'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M14.146 6.75159C14.2105 7.10896 14.2703 7.48131 14.3281 7.86164C14.2189 7.85865 14.1095 7.85714 14 7.85714C13.3803 7.85714 12.7648 7.90539 12.159 7.99779C11.879 7.41458 11.5547 6.82246 11.1872 6.23145C8.69897 2.22947 6.53826 1.98679 4.67882 2.98366C2.81938 3.98052 2.85628 6.67644 5.26696 9.40538C5.58076 9.76061 5.90097 10.1398 6.2247 10.5286C3.69013 12.4659 2 15.2644 2 18.2695C2 23.8292 7.78518 25 14 25C20.2148 25 26 23.8292 26 18.2695C26 14.8658 23.8318 11.7272 20.7243 9.80476C20.9022 8.86044 21 7.83019 21 6.75159C21 2.19612 19.2549 1 17.1022 1C14.9495 1 13.5261 3.31847 14.146 6.75159Z' fill='url(%23paint0_linear_bunnyhead_main)'/%3E%3C/g%3E%3Cg transform='translate(2)'%3E%3Cpath d='M12.7284 16.4446C12.796 17.3149 12.4446 19.0556 10.498 19.0556' stroke='%23452A7A' stroke-linecap='round'/%3E%3Cpath d='M12.7457 16.4446C12.6781 17.3149 13.0296 19.0556 14.9761 19.0556' stroke='%23452A7A' stroke-linecap='round'/%3E%3Cpath d='M9 14.5C9 15.6046 8.55228 16 8 16C7.44772 16 7 15.6046 7 14.5C7 13.3954 7.44772 13 8 13C8.55228 13 9 13.3954 9 14.5Z' fill='%23452A7A'/%3E%3Cpath d='M18 14.5C18 15.6046 17.5523 16 17 16C16.4477 16 16 15.6046 16 14.5C16 13.3954 16.4477 13 17 13C17.5523 13 18 13.3954 18 14.5Z' fill='%23452A7A'/%3E%3C/g%3E%3Cdefs%3E%3Cfilter id='filter0_d'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'/%3E%3CfeOffset dy='1'/%3E%3CfeGaussianBlur stdDeviation='1'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0'/%3E%3CfeBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow'/%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow' result='shape'/%3E%3C/filter%3E%3ClinearGradient id='paint0_linear_bunnyhead_main' x1='14' y1='1' x2='14' y2='25' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%2353DEE9'/%3E%3Cstop offset='1' stop-color='%231FC7D4'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E%0A"`;
const bunnyButt = `"data:image/svg+xml,%3Csvg width='15' height='32' viewBox='0 0 15 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M9.58803 20.8649C7.72935 21.3629 8.02539 24.0334 8.76388 26.7895C9.50238 29.5456 10.5812 32.0062 12.4399 31.5082C14.2986 31.0102 15.2334 28.0099 14.4949 25.2538C13.7564 22.4978 11.4467 20.3669 9.58803 20.8649Z' fill='%230098A1'/%3E%3Cpath d='M1 24.4516C1 20.8885 3.88849 18 7.45161 18H15V28H4.54839C2.58867 28 1 26.4113 1 24.4516Z' fill='%231FC7D4'/%3E%3Cpath d='M6.11115 17.2246C6.79693 18.4124 5.77784 19.3343 4.52793 20.0559C3.27802 20.7776 1.97011 21.1992 1.28433 20.0114C0.598546 18.8236 1.1635 17.1151 2.41341 16.3935C3.66332 15.6718 5.42537 16.0368 6.11115 17.2246Z' fill='%2353DEE9'/%3E%3Cpath d='M1.64665 23.6601C0.285995 25.0207 1.87759 27.1854 3.89519 29.203C5.91279 31.2206 8.07743 32.8122 9.43808 31.4515C10.7987 30.0909 10.1082 27.0252 8.09058 25.0076C6.07298 22.99 3.0073 22.2994 1.64665 23.6601Z' fill='%231FC7D4'/%3E%3C/svg%3E"`;

const getBaseThumbStyles = ({ isMax, disabled }: StyledInputProps) => `
  -webkit-appearance: none;
  background-image: url(${isMax ? bunnyHeadMax : bunnyHeadMain});
  background-color: transparent;
  box-shadow: none;
  border: 0;
  cursor: ${getCursorStyle};
  width: 24px;
  height: 32px;
  filter: ${disabled ? "grayscale(100%)" : "none"};
  transform: translate(-2px, -2px);
  transition: 200ms transform;
  &:hover {
    transform: ${disabled ? "scale(1) translate(-2px, -2px)" : "scale(1.1) translate(-3px, -3px)"};
  }
`;

export const SliderLabelContainer = styled.div`
  bottom: 0;
  position: absolute;
  left: 14px;
  width: calc(100% - 30px);
`;

export const SliderLabel = styled(Text)<SliderLabelProps>`
  bottom: 0;
  font-size: 12px;
  left: ${({ progress }) => progress};
  position: absolute;
  text-align: center;
  min-width: 24px; // Slider thumb size
`;

export const BunnyButt = styled.div<DisabledProp>`
  background: url(${bunnyButt}) no-repeat;
  height: 32px;
  filter: ${({ disabled }) => (disabled ? "grayscale(100%)" : "none")};
  position: absolute;
  width: 15px;
`;

export const BunnySlider = styled.div`
  position: absolute;
  left: 14px;
  width: calc(100% - 14px);
`;

export const StyledInput = styled.input<StyledInputProps>`
  cursor: ${getCursorStyle};
  height: 32px;
  position: relative;
  ::-webkit-slider-thumb {
    ${getBaseThumbStyles}
  }
  ::-moz-range-thumb {
    ${getBaseThumbStyles}
  }
  ::-ms-thumb {
    ${getBaseThumbStyles}
  }
`;

export const BarBackground = styled.div<DisabledProp>`
  background-color: ${({ theme, disabled }) => theme.colors[disabled ? "textDisabled" : "inputSecondary"]};
  height: 2px;
  position: absolute;
  top: 18px;
  width: 100%;
`;

export const BarProgress = styled.div<DisabledProp>`
  background-color: ${({ theme }) => theme.colors.primary};
  filter: ${({ disabled }) => (disabled ? "grayscale(100%)" : "none")};
  height: 10px;
  position: absolute;
  top: 18px;
`;
