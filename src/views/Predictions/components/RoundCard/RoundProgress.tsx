import React from 'react'
import { Progress, ProgressProps } from '@pancakeswap-libs/uikit'
import { useBlock } from 'state/hooks'

interface LiveRoundProgressProps extends ProgressProps {
  startBlock: number
  endBlock: number
}

const LiveRoundProgress: React.FC<LiveRoundProgressProps> = ({ startBlock, endBlock, ...props }) => {
  const { currentBlock } = useBlock()
  const rawProgress = ((currentBlock - startBlock) / (endBlock - startBlock)) * 100
  const progress = rawProgress <= 100 ? rawProgress : 100

  return <Progress variant="flat" primaryStep={progress} {...props} />
}

export default LiveRoundProgress
