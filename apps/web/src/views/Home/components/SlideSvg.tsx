import { Svg, SvgProps } from '@pancakeswap/uikit'

export const SlideSvgLight: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 1660 339" {...props}>
      <path
        d="M804 245.523C480 111.523 91.5 128 0 201V339H1660V0C1358.83 400 800 273.523 797.888 236.523Z"
        fill="url(#paint0_linear_light)"
      />
      <defs>
        <linearGradient id="paint0_linear_light" x1="830" y1="84" x2="830" y2="339" gradientUnits="userSpaceOnUse">
          <stop stopColor="#000" />
          <stop offset="0.545554" stopColor="#000" stopOpacity="1" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
      </defs>
    </Svg>
  )
}

export const SlideSvgDark: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 1660 339" {...props}>
      <path
        d="M804 245.523C480 111.523 91.5 128 0 201V339H1660V0C1358.83 400 800 273.523 797.888 236.523Z"
        fill="url(#paint0_linear_dark)"
      />
      <defs>
        <linearGradient id="paint0_linear_dark" x1="830" y1="83.5" x2="830" y2="338.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#000" />
          <stop offset="0.545554" stopColor="#000" stopOpacity="1" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
      </defs>
    </Svg>
  )
}
