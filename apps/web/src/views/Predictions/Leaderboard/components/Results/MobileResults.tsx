import { Box } from '@pancakeswap/uikit'
import { PredictionUser } from 'state/types'
import MobileRow from './MobileRow'

interface MobileResultsProps {
  results: PredictionUser[]
  pickedTokenSymbol: string
}

const MobileResults: React.FC<React.PropsWithChildren<MobileResultsProps>> = ({ results, pickedTokenSymbol }) => {
  return (
    <Box mb="24px">
      {results.map((result, index) => (
        <MobileRow key={result.id} rank={index + 4} user={result} pickedTokenSymbol={pickedTokenSymbol} />
      ))}
    </Box>
  )
}

export default MobileResults
