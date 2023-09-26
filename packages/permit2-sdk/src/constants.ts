export const PERMIT2_ADDRESS = '0x000000000022D473030F116dDEE9F6B43aC78BA3'

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
