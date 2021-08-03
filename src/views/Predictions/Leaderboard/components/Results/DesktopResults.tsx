import React from 'react'
import { PredictionUser } from 'state/types'

interface DesktopResultsProps {
  results: PredictionUser[]
}

const DesktopResults: React.FC<DesktopResultsProps> = () => {
  return <div>Desktop results</div>
}

export default DesktopResults
