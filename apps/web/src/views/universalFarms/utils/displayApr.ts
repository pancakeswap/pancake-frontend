import { formatAmount } from 'utils/formatInfoNumbers'

export const displayApr = (
  apr: number,
  options?: {
    suffix?: string
  },
) => {
  const { suffix = '%' } = options ?? {
    suffix: '%',
  }

  return `${formatAmount(apr * 100)}${suffix}`
}
