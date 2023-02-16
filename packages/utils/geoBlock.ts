// Sanctioned Countries: Belarus, Cuba, Democratic Republic of Congo, Iran, Iraq, North Korea, Sudan, Syria, Zimbabwe.
const BLOCK_COUNTRIES = { BY: 'BY', CU: 'CU', CD: 'CD', IR: 'IR', IQ: 'IQ', KP: 'KP', SD: 'SD', SY: 'SY', ZW: 'ZW' }

// Sanctioned Regions: Crimea
const BLOCK_REGIONS = { 'UA-43': 'UA-43' }

export const shouldGeoBlock = (geo?: { country?: string; region?: string }): boolean => {
  if (!geo) return false

  const { country, region } = geo

  if (!country) return false

  const shouldBlock: boolean = BLOCK_COUNTRIES[country] || BLOCK_REGIONS[`${country}-${region}`]

  return shouldBlock
}
