interface FormatRoiArgs {
  lockedApy: string
  usdValueStaked: number
  duration: number
}

export default function formatRoi(roiArgs: FormatRoiArgs): string {
  const { lockedApy, usdValueStaked, duration } = roiArgs

  const roi = usdValueStaked * (Number(lockedApy) / 100) * (duration / 31449600)
  const roiFractionDigits = roi > 10000 ? 0 : 2

  return roi.toLocaleString('en', {
    minimumFractionDigits: roiFractionDigits,
    maximumFractionDigits: roiFractionDigits,
  })
}
