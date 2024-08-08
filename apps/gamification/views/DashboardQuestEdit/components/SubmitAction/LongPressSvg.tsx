import { Svg } from '@pancakeswap/uikit'

interface LongPressSvgProps {
  progress: number
}

export const LongPressSvg: React.FC<LongPressSvgProps> = ({ progress }) => {
  const size = 20
  const strokeWidth = 4
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  return (
    <Svg ml="8px" width={size} height={size}>
      <circle
        r={radius}
        cx={size / 2}
        cy={size / 2}
        opacity="0.5"
        stroke="white"
        fill="transparent"
        strokeWidth={strokeWidth}
      />
      <circle
        r={radius}
        cx={size / 2}
        cy={size / 2}
        stroke="white"
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={circumference - (progress / 100) * circumference}
        style={{
          transform: 'rotate(-90deg)',
          transformOrigin: '50% 50%',
        }}
      />
    </Svg>
  )
}
