import { Box } from '@pancakeswap/uikit'
import { ReactNode } from 'react'

interface CellFormatProps {
  firstRow: ReactNode
  secondRow: ReactNode
}

const CellFormat: React.FC<CellFormatProps> = ({ firstRow, secondRow }) => {
  return (
    <Box>
      <Box mb="4px">{firstRow}</Box>
      <Box>{secondRow}</Box>
    </Box>
  )
}

export default CellFormat
