import { Svg, SvgProps, vars } from '@pancakeswap/uikit'

const GradientLogo: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 499.05 471.98" {...props}>
      <g>
        <path
          d="M454.55,274.3c0-27.38-8.02-49.79-19.52-67.8l64.02-64.02l-64.48-64.52l-68.78,68.78c2.84-8.7,6.26-19.69,9.35-31.05
				c4.4-16.17,8.7-35.14,8.7-49.04c0-16.45-3.62-32.98-13.4-45.82C360.11,7.27,344.57,0,325.87,0c-14.62,0-27.02,5.37-36.73,14.62
				c-9.29,8.85-15.46,20.6-19.73,32.85c-7.5,21.52-10.42,48.57-11.24,75.55h-17.91c-0.82-26.99-3.74-54.03-11.24-75.55
				c-4.26-12.25-10.44-24-19.73-32.85C199.59,5.37,187.18,0,172.57,0c-18.7,0-34.24,7.27-44.57,20.83
				c-9.77,12.84-13.4,29.37-13.4,45.82c0,13.9,4.31,32.87,8.7,49.04c2.98,10.96,6.27,21.58,9.05,30.13L64.5,77.97L0,142.47
				l63.65,63.66c-11.63,18.08-19.76,40.61-19.76,68.18c0,25.56,6.53,49.37,19.06,70.21L0,407.47l64.48,64.52l67.95-67.95
				c31.72,14.51,70.95,22.38,116.63,22.42h0.31c45.88-0.03,85.25-7.98,117.04-22.6l68.13,68.13l64.5-64.5l-63.33-63.34
				C448.1,323.38,454.55,299.71,454.55,274.3z M148.58,159.07c3.87-1.53,6-5.84,4.65-9.78c-6.01-17.51-20.66-62.49-20.66-84.95
				c0-28.26,12.61-48.69,39.99-48.69c39.42,0,49.25,55.84,49.95,115.77c0.05,4,3.28,7.25,7.28,7.25h38.84c4,0,7.24-3.25,7.28-7.25
				c0.7-59.93,10.53-115.77,49.95-115.77c27.39,0,39.99,20.43,39.99,48.69c0,22.46-14.65,67.44-20.66,84.95
				c-1.35,3.94,0.77,8.25,4.65,9.78c21.95,8.65,86.72,40.34,86.72,112.92c0,2.4-0.06,4.77-0.19,7.13
				c-7.18,58.37-101.22,102.56-187.02,102.56c-89.12,0-187.19-47.67-187.5-109.41c0-0.1-0.01-0.19-0.01-0.29
				C61.86,199.41,126.63,167.72,148.58,159.07z"
          fill={vars.colors.contrast}
        />
        <path
          d="M173.95,279.22c11.88,0,21.5-10.61,21.5-30.98c0-20.37-9.63-30.98-21.5-30.98c-11.87,0-21.5,10.61-21.5,30.98
				C152.45,268.61,162.07,279.22,173.95,279.22z"
          fill={vars.colors.contrast}
        />
        <path
          d="M313.7,279.22c11.87,0,21.5-10.61,21.5-30.98c0-20.37-9.63-30.98-21.5-30.98c-11.88,0-21.5,10.61-21.5,30.98
				C292.2,268.61,301.83,279.22,313.7,279.22z"
          fill={vars.colors.contrast}
        />
      </g>
    </Svg>
  )
}

export default GradientLogo
