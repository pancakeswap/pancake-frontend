import { ChainId, Pair } from '@pancakeswap/aptos-swap-sdk'
import type { SerializedFarmConfig } from '@pancakeswap/farms'
import { APT, CAKE } from 'config/coins'
import { mainnetTokens } from 'config/constants/tokens'

const priceHelperLps: Omit<SerializedFarmConfig, 'pid'>[] = [
  {
    pid: null,
    lpSymbol: 'amAPT-APT LP',
    quoteToken: APT[ChainId.MAINNET],
    token: mainnetTokens.amapt,
  },
  {
    pid: null,
    lpSymbol: 'APT-stAPT LP',
    quoteToken: APT[ChainId.MAINNET],
    token: mainnetTokens.stapt,
  },
  {
    pid: null,
    lpSymbol: 'APT-CAKE LP',
    quoteToken: APT[ChainId.MAINNET],
    token: CAKE[ChainId.MAINNET],
  },
  {
    pid: null,
    lpSymbol: 'APT-ceBNB LP',
    quoteToken: APT[ChainId.MAINNET],
    token: mainnetTokens.cebnb,
  },
  {
    pid: null,
    lpSymbol: 'APT-ETERN LP',
    quoteToken: APT[ChainId.MAINNET],
    token: mainnetTokens.etern,
  },
  {
    pid: null,
    lpSymbol: 'APT-lzUSDC LP',
    lpAddress:
      '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::LPToken<0x1::aptos_coin::AptosCoin, 0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC>',
    token: mainnetTokens.lzusdc,
    quoteToken: mainnetTokens.apt,
  },
].map((p) => ({
  ...p,
  token: p.token.serialize,
  quoteToken: p.quoteToken.serialize,
  lpAddress: Pair.getAddress(p.token, p.quoteToken),
}))

export default priceHelperLps
