import React from 'react'
import { FarmWithStakedValue } from './FarmCard'

interface RowProps {
  farm: FarmWithStakedValue
}

const FarmRow: React.FunctionComponent<RowProps> = ({ farm }) => {
  return (
    <tr>
      test
    </tr>
  )
}

export default FarmRow