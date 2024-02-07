import { ChainId } from '@pancakeswap/chains'
import { Address } from 'viem'

// @fixme convert to ChainId after all chains are updated
// const PERMIT2_ADDRESSES: Record<ChainId, Address> = {
const PERMIT2_ADDRESSES: Record<number, Address> = {
  [ChainId.ETHEREUM]: '0x31c2F6fcFf4F8759b3Bd5Bf0e1084A055615c768',
  [ChainId.GOERLI]: '0x31c2F6fcFf4F8759b3Bd5Bf0e1084A055615c768',

  [ChainId.BSC]: '0x31c2F6fcFf4F8759b3Bd5Bf0e1084A055615c768',
  [ChainId.BSC_TESTNET]: '0x31c2F6fcFf4F8759b3Bd5Bf0e1084A055615c768',

  // [ChainId.SCROLL]: '0x31c2F6fcFf4F8759b3Bd5Bf0e1084A055615c768',
  [ChainId.SCROLL_SEPOLIA]: '0x31c2F6fcFf4F8759b3Bd5Bf0e1084A055615c768',

  [ChainId.ARBITRUM_ONE]: '0x31c2F6fcFf4F8759b3Bd5Bf0e1084A055615c768',
  [ChainId.ARBITRUM_GOERLI]: '0x31c2F6fcFf4F8759b3Bd5Bf0e1084A055615c768',

  [ChainId.BASE]: '0x31c2F6fcFf4F8759b3Bd5Bf0e1084A055615c768',
  [ChainId.BASE_TESTNET]: '0x31c2F6fcFf4F8759b3Bd5Bf0e1084A055615c768',

  [ChainId.POLYGON_ZKEVM]: '0x31c2F6fcFf4F8759b3Bd5Bf0e1084A055615c768',
  [ChainId.POLYGON_ZKEVM_TESTNET]: '0x31c2F6fcFf4F8759b3Bd5Bf0e1084A055615c768',

  [ChainId.LINEA]: '0x31c2F6fcFf4F8759b3Bd5Bf0e1084A055615c768',
  [ChainId.LINEA_TESTNET]: '0x31c2F6fcFf4F8759b3Bd5Bf0e1084A055615c768',

  [ChainId.ZKSYNC]: '0x686FD50007EaA636F01154d660b96110B6bFe351',
  [ChainId.ZKSYNC_TESTNET]: '0xaf321b731E65715DdbFDa73A066E00BB28345709',

  [ChainId.OPBNB]: '0x31c2F6fcFf4F8759b3Bd5Bf0e1084A055615c768',
  [ChainId.OPBNB_TESTNET]: '0x31c2F6fcFf4F8759b3Bd5Bf0e1084A055615c768',
}

export const getPermit2Address = (chainId: ChainId | undefined): Address => {
  if (chainId === undefined) return PERMIT2_ADDRESSES[ChainId.BSC]
  if (!(chainId in PERMIT2_ADDRESSES)) throw new Error(`Permit2 Contract not deployed on chain ${chainId}`)
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
