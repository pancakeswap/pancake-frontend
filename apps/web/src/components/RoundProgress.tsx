import { Progress, ProgressProps } from '@pancakeswap/uikit'

interface RoundProgressProps extends ProgressProps {
  getNow: () => number
  lockTimestamp: number
  closeTimestamp: number
}

const RoundProgress: React.FC<React.PropsWithChildren<RoundProgressProps>> = ({
  getNow,
  lockTimestamp,
  closeTimestamp,
  ...props
}) => {
  const startMs = lockTimestamp * 1000
  const endMs = closeTimestamp * 1000
  let progress
  if (getNow) {
    const now = getNow() * 1000
    const rawProgress = ((now - startMs) / (endMs - startMs)) * 100
    progress = rawProgress <= 100 ? rawProgress : 100
  } else {
    progress = 0
  }

  return <Progress primaryStep={progress} {...props} />
}

export default RoundProgress
