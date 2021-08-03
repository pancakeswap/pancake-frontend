import React from 'react'
import { PredictionUser } from 'state/types'
import MobileRow from './MobileRow'

interface MobileResultsProps {
  results: PredictionUser[]
}

const MobileResults: React.FC<MobileResultsProps> = ({ results }) => {
  return (
    <>
      {results.map((result, index) => (
        <MobileRow key={result.id} rank={index + 4} user={result} />
      ))}
    </>
  )
}

export default MobileResults
