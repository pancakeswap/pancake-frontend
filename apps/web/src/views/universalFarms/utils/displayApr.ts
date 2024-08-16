export const displayApr = (
  apr: number,
  options?: {
    maximumFractionDigits?: number
    suffix?: string
  },
) => {
  const { maximumFractionDigits = 2, suffix = '%' } = options ?? {
    maximumFractionDigits: 2,
    suffix: '%',
  }
  return `${(apr * 100).toLocaleString('en-US', { maximumFractionDigits })}${suffix}`
}
