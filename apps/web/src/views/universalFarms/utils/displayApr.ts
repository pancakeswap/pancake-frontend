export const displayApr = (apr: number, maximumFractionDigits = 2) =>
  `${(apr * 100).toLocaleString('en-US', { maximumFractionDigits })}%`
