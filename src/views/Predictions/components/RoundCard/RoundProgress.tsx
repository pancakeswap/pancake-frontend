import React from 'react'
import { Progress } from '@pancakeswap-libs/uikit'
import { useBlock } from 'state/hooks'

interface LiveRoundProgressProps {
  startBlock: number
  endBlock: number
}

const LiveRoundProgress: React.FC<LiveRoundProgressProps> = ({ startBlock, endBlock }) => {
  const { blockNumber } = useBlock()
  const rawProgress = ((blockNumber - startBlock) / (endBlock - startBlock)) * 100
  const progress = rawProgress <= 100 ? rawProgress : 100

  return <Progress variant="flat" primaryStep={progress} />
}

export default LiveRoundProgress
