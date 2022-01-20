import React from 'react'
import { Progress, ProgressProps } from '@pancakeswap/uikit'
import { useCurrentBlock } from 'state/block/hooks'

interface BlockProgressProps extends ProgressProps {
  startBlock: number
  endBlock: number
}

const BlockProgress: React.FC<BlockProgressProps> = ({ startBlock, endBlock, ...props }) => {
  const currentBlock = useCurrentBlock()
  const rawProgress = ((currentBlock - startBlock) / (endBlock - startBlock)) * 100
  const progress = rawProgress <= 100 ? rawProgress : 100

  return <Progress primaryStep={progress} {...props} />
}

export default BlockProgress
