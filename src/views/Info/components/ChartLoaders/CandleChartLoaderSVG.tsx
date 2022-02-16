import { Svg, SvgProps } from '@pancakeswap/uikit'

const CandleChartLoaderSVG: React.FC<SvgProps> = (props) => {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 100 50" opacity="0.1" {...props}>
      <rect width="5%" fill="#31D0AA">
        <animate
          attributeName="height"
          dur="2s"
          values="0%; 40%; 40%; 10%; 10%"
          keyTimes="0; 0.125; 0.5; 0.625; 1"
          repeatCount="indefinite"
        />
        <animate
          attributeName="y"
          dur="2s"
          from="50%"
          to="30%"
          values="30%; 10%; 10%; 25%; 25%"
          keyTimes="0; 0.125; 0.5; 0.625; 1"
          repeatCount="indefinite"
        />
        <animate
          attributeName="rx"
          dur="2s"
          values="0%; 0%; 100%; 100%;"
          keyTimes="0; 0.6; 0.625; 1"
          repeatCount="indefinite"
        />
        <animate
          attributeName="x"
          dur="2s"
          values="32.5%; 32.5%; 47.5%; 47.5%;"
          keyTimes="0; 0.7; 0.8; 1"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          dur="2s"
          values="1; 1; 0; 0;"
          keyTimes="0; 0.75; 0.9; 1"
          repeatCount="indefinite"
        />
      </rect>
      <rect width="5%" fill="#31D0AA">
        <animate
          attributeName="height"
          dur="2s"
          values="0%; 0%; 20%; 20%; 10%; 10%"
          keyTimes="0; 0.125; 0.25; 0.5; 0.625; 1"
          repeatCount="indefinite"
        />
        <animate
          attributeName="y"
          dur="2s"
          values="15%; 15%; 5%; 5%; 25%; 25%"
          keyTimes="0; 0.125; 0.25; 0.5; 0.625; 1"
          repeatCount="indefinite"
        />
        <animate
          attributeName="rx"
          dur="2s"
          values="0%; 0%; 100%; 100%;"
          keyTimes="0; 0.6; 0.625; 1"
          repeatCount="indefinite"
        />
        <animate
          attributeName="x"
          dur="2s"
          values="42.5%; 42.5%; 47.5%; 47.5%;"
          keyTimes="0; 0.7; 0.8; 1"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          dur="2s"
          values="1; 1; 0; 0;"
          keyTimes="0; 0.75; 0.9; 1"
          repeatCount="indefinite"
        />
      </rect>
      <rect width="5%" fill="#ED4B9E">
        <animate
          attributeName="height"
          dur="2s"
          values="0%; 0%; 35%; 35%; 10%; 10%"
          keyTimes="0; 0.25; 0.375; 0.5; 0.625; 1"
          repeatCount="indefinite"
        />
        <animate
          attributeName="y"
          dur="2s"
          values="25%; 25%; 10%; 10%; 25%; 25%"
          keyTimes="0; 0.25; 0.375; 0.5; 0.625; 1"
          repeatCount="indefinite"
        />
        <animate
          attributeName="rx"
          dur="2s"
          values="0%; 0%; 100%; 100%;"
          keyTimes="0; 0.6; 0.625; 1"
          repeatCount="indefinite"
        />
        <animate
          attributeName="x"
          dur="2s"
          values="52.5%; 52.5%; 47.5%; 47.5%;"
          keyTimes="0; 0.7; 0.8; 1"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          dur="2s"
          values="1; 1; 0; 0;"
          keyTimes="0; 0.75; 0.9; 1"
          repeatCount="indefinite"
        />
      </rect>
      <rect width="5%" fill="#31D0AA">
        <animate
          attributeName="height"
          dur="2s"
          values="0%; 0%; 35%; 35%; 10%; 10%"
          keyTimes="0; 0.375; 0.5; 0.5; 0.625; 1"
          repeatCount="indefinite"
        />
        <animate
          attributeName="y"
          dur="2s"
          values="15%; 15%; 0%; 0%; 25%; 25%"
          keyTimes="0; 0.375; 0.5; 0.5; 0.625; 1"
          repeatCount="indefinite"
        />
        <animate
          attributeName="rx"
          dur="2s"
          values="0%; 0%; 100%; 100%;"
          keyTimes="0; 0.6; 0.625; 1"
          repeatCount="indefinite"
        />
        <animate
          attributeName="x"
          dur="2s"
          values="62.5%; 62.5%; 47.5%; 47.5%;"
          keyTimes="0; 0.7; 0.8; 1"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          dur="2s"
          values="1; 1; 0; 0;"
          keyTimes="0; 0.75; 0.9; 1"
          repeatCount="indefinite"
        />
      </rect>
    </Svg>
  )
}

export default CandleChartLoaderSVG
