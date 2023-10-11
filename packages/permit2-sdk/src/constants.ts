import { ChainId } from '@pancakeswap/chains'
import { Address } from 'viem'

const PERMIT2_ADDRESSES: { [key: number]: Address } = {
  [ChainId.ETHEREUM]: '0x0000000000000000000000000000000000000000',
  [ChainId.GOERLI]: '0x31c2F6fcFf4F8759b3Bd5Bf0e1084A055615c768',
  [ChainId.BSC]: '0x31c2F6fcFf4F8759b3Bd5Bf0e1084A055615c768',
  [ChainId.BSC_TESTNET]: '0x31c2F6fcFf4F8759b3Bd5Bf0e1084A055615c768',
  [ChainId.SCROLL_SEPOLIA]: '0x0000000000000000000000000000000000000000',
  [ChainId.ARBITRUM_ONE]: '0x0000000000000000000000000000000000000000',
  [ChainId.ARBITRUM_GOERLI]: '0xCaCC5DF33e3AF664158eaaB87bc8f282C674ec25',
  [ChainId.BASE_TESTNET]: '0xCaCC5DF33e3AF664158eaaB87bc8f282C674ec25',
  [ChainId.BASE]: '0x0000000000000000000000000000000000000000',
  [ChainId.POLYGON_ZKEVM]: '0x0000000000000000000000000000000000000000',
  [ChainId.POLYGON_ZKEVM_TESTNET]: '0xCaCC5DF33e3AF664158eaaB87bc8f282C674ec25',
  [ChainId.LINEA]: '0x0000000000000000000000000000000000000000',
  [ChainId.LINEA_TESTNET]: '0xCeccEEA1ee8f7420aB5A0daFA56faF39Ee794933',
  [ChainId.OPBNB_TESTNET]: '0xCaCC5DF33e3AF664158eaaB87bc8f282C674ec25',
  [ChainId.ZKSYNC]: '0x0000000000000000000000000000000000000000',
  [ChainId.ZKSYNC_TESTNET]: '0x0000000000000000000000000000000000000000',
}

export const PERMIT2_ADDRESS = (chainId: number | undefined): Address => {
  if (chainId === undefined) return PERMIT2_ADDRESSES[56]
  if (!(chainId in PERMIT2_ADDRESSES)) throw new Error(`Universal Router not deployed on chain ${chainId}`)
  return PERMIT2_ADDRESSES[chainId]
}

export const MaxUint48 = BigInt('0xffffffffffff')
export const MaxUint160 = BigInt('0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF')
export const MaxUint256 = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')

// alias max types for their usages
// allowance transfer types
export const MaxAllowanceTransferAmount = MaxUint160
export const MaxAllowanceExpiration = MaxUint48
export const MaxOrderedNonce = MaxUint48

// signature transfer types
export const MaxSignatureTransferAmount = MaxUint256
export const MaxUnorderedNonce = MaxUint256
export const MaxSigDeadline = MaxUint256

export const PERMIT_EXPIRATION = 2592000000 // 30 day
export const PERMIT_SIG_EXPIRATION = 1800000 // 30 min

export const InstantExpiration = BigInt('0')
