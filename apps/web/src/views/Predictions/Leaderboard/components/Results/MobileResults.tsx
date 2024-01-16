import { Token } from '@pancakeswap/sdk'
import { Box } from '@pancakeswap/uikit'
import { PredictionUser } from 'state/types'
import MobileRow from './MobileRow'

interface MobileResultsProps {
  results: PredictionUser[]
  token: Token | undefined
  api: string
}

const MobileResults: React.FC<React.PropsWithChildren<MobileResultsProps>> = ({ results, token, api }) => {
  return (
    <Box mb="24px">
      {results.map((result, index) => (
        <MobileRow key={result.id} rank={index + 4} user={result} token={token} api={api} />
      ))}
    </Box>
  )
}

export default MobileResults
