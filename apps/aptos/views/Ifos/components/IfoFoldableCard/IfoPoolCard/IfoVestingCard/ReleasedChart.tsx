interface ReleasedChartProps {
  percentage: number
}

const ReleasedChart: React.FC<React.PropsWithChildren<ReleasedChartProps>> = ({ percentage }) => {
  return (
    <svg width="78px" height="78px" viewBox="0 0 42 42" style={{ transform: 'rotate(-90deg) scaleY(-1)' }}>
      <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#7645D9" strokeWidth="5" />
      <circle
        cx="21"
        cy="21"
        r="15.91549430918954"
        fill="transparent"
        stroke="#D7CAEC"
        strokeWidth="5"
        strokeDasharray="100"
        strokeDashoffset={percentage}
      />
    </svg>
  )
}

export default ReleasedChart
