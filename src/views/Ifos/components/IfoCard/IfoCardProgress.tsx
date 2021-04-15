import React from 'react'
import { Box, Progress } from 'greenteaswap-ui-kit'

interface IfoCardProgressProps {
  progress: number
}

const IfoCardProgress: React.FC<IfoCardProgressProps> = ({ progress }) => {
  return (
    <Box mb="16px">
      <Progress primaryStep={progress} />
    </Box>
  )
}

export default IfoCardProgress
