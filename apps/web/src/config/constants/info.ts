export const MINIMUM_SEARCH_CHARACTERS = 2

export const WEEKS_IN_YEAR = 52.1429

export const TOTAL_FEE = 0.0025
export const LP_HOLDERS_FEE = 0.0017
export const TREASURY_FEE = 0.0003
export const BUYBACK_FEE = 0.0005

export const PCS_V2_START = 1619136000 // April 23, 2021, 12:00:00 AM
export const ONE_DAY_UNIX = 86400 // 24h * 60m * 60s
export const ONE_HOUR_SECONDS = 3600

export const ITEMS_PER_INFO_TABLE_PAGE = 10

// These tokens are either incorrectly priced or have some other issues that spoil the query data
// None of them present any interest as they have almost 0 daily trade volume
export const TOKEN_BLACKLIST = [
  // These ones are copied from v1 info
  '0x495c7f3a713870f68f8b418b355c085dfdc412c3',
  '0xc3761eb917cd790b30dad99f6cc5b4ff93c4f9ea',
  '0xe31debd7abff90b06bca21010dd860d8701fd901',
  '0xfc989fbb6b3024de5ca0144dc23c18a063942ac1',
  '0xe40fc6ff5f2895b44268fd2e1a421e07f567e007',
  '0xfd158609228b43aa380140b46fff3cdf9ad315de',
  '0xc00af6212fcf0e6fd3143e692ccd4191dc308bea',
  '0x205969b3ad459f7eba0dee07231a6357183d3fb6',
  '0x0bd67d358636fd7b0597724aa4f20beedbf3073a',
  '0xedf5d2a561e8a3cb5a846fbce24d2ccd88f50075',
  '0x702b0789a3d4dade1688a0c8b7d944e5ba80fc30',
  '0x041929a760d7049edaef0db246fa76ec975e90cc',
  '0xba098df8c6409669f5e6ec971ac02cd5982ac108',
  '0x1bbed115afe9e8d6e9255f18ef10d43ce6608d94',
  '0xe99512305bf42745fae78003428dcaf662afb35d',
  '0xbE609EAcbFca10F6E5504D39E3B113F808389056',
  '0x847daf9dfdc22d5c61c4a857ec8733ef5950e82e',
  '0xdbf8913dfe14536c0dae5dd06805afb2731f7e7b',
  // These ones are newly found
  '0xF1D50dB2C40b63D2c598e2A808d1871a40b1E653',
  '0x4269e4090ff9dfc99d8846eb0d42e67f01c3ac8b',
]
