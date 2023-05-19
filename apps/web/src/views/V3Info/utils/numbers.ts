// using a currency library here in case we want to add more in future
export const formatDollarAmount = (num: number | undefined, digits = 2, round = true) => {
  if (num <= 0) return '$0.00'
  if (!num) return '-'
  if (num < 0.001 && digits <= 3) {
    return '<$0.001'
  }

  return Intl.NumberFormat('en-US', {
    notation: round ? 'compact' : 'standard',
    minimumFractionDigits: num > 1000 ? 2 : digits,
    maximumFractionDigits: num > 1000 ? 2 : digits,
  }).format(num)
}

// using a currency library here in case we want to add more in future
export const formatAmount = (num: number | undefined, digits = 2) => {
  if (num <= 0) return '0'
  if (!num) return '-'
  if (num < 0.001) {
    return '<0.001'
  }

  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    minimumFractionDigits: num > 1000 ? 2 : digits,
    maximumFractionDigits: num > 1000 ? 2 : digits,
  }).format(num)
}
