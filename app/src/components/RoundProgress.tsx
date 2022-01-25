import React from 'react'
import { Progress, ProgressProps } from '@pancakeswap/uikit'

interface RoundProgressProps extends ProgressProps {
  lockTimestamp: number
  closeTimestamp: number
}

const RoundProgress: React.FC<RoundProgressProps> = ({ lockTimestamp, closeTimestamp, ...props }) => {
  const startMs = lockTimestamp * 1000
  const endMs = closeTimestamp * 1000
  const now = Date.now()
  const rawProgress = ((now - startMs) / (endMs - startMs)) * 100
  const progress = rawProgress <= 100 ? rawProgress : 100

  return <Progress primaryStep={progress} {...props} />
}

export default RoundProgress
