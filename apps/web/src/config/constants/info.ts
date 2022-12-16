export const MINIMUM_SEARCH_CHARACTERS = 2

export const WEEKS_IN_YEAR = 52.1429

export const TOTAL_FEE = 0.0025
export const LP_HOLDERS_FEE = 0.0017
export const TREASURY_FEE = 0.000225
export const BUYBACK_FEE = 0.000575

export const PCS_V2_START = 1619136000 // April 23, 2021, 12:00:00 AM
export const PCS_ETH_START = 1664130827 // Sep 23, 2022, 02:33:47 AM
export const ONE_DAY_UNIX = 86400 // 24h * 60m * 60s
export const ONE_HOUR_SECONDS = 3600

export const ITEMS_PER_INFO_TABLE_PAGE = 10
export const LP_HOLDERS_FEE_STABLE_AND_LP = {
  '0x169f653a54acd441ab34b73da9946e2c451787ef': 0.00075, // USDT/BUSD StableSwap
  '0x36842f8fb99d55477c0da638af5ceb6bbf86aa98': 0.00075, // USDT/BUSD LP
  '0xc2f5b9a3d9138ab2b74d581fc11346219ebf43fe': 0.00075, // USDC/BUSD StableSwap
  '0x1a77c359d0019cd8f4d36b7cdf5a88043d801072': 0.00075, // USDC/BUSD LP
  '0x3efebc418efb585248a0d2140cfb87afcc2c63dd': 0.00075, // USDT/USDC StableSwap
  '0xee1bcc9f1692e81a281b3a302a4b67890ba4be76': 0.00075, // USDT/USDC LP
  '0x49079d07ef47449af808a4f36c2a8dec975594ec': 0.0002, // HAY/BUSD StableSwap
  '0xb6040a9f294477ddadf5543a24e5463b8f2423ae': 0.0002, // HAY/BUSD LP
}

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

export const ETH_TOKEN_BLACKLIST = ['0x72b169ad8af6c4fb53056b6a2a85602ad6863864']
