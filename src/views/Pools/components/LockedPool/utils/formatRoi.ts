import { formatNumber } from 'utils/formatBalance'

interface FormatRoiArgs {
  lockedApy: string
  usdValueStaked: number
}

export default function formatRoi(roiArgs: FormatRoiArgs): string {
  const { lockedApy, usdValueStaked } = roiArgs

  const roi = usdValueStaked * (Number(lockedApy) / 100)

  return formatNumber(roi, roi > 10000 ? 0 : 2, roi > 10000 ? 0 : 2)
}
