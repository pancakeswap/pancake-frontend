import { formatNumber } from 'utils/formatBalance'

export default function formatRoi({ lockedApy, usdValueStaked }) {
  const roi = usdValueStaked * (Number(lockedApy) / 100)

  return formatNumber(roi, roi > 10000 ? 0 : 2, roi > 10000 ? 0 : 2)
}
