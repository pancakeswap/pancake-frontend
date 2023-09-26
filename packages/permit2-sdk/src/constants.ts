export const PERMIT2_ADDRESS = '0x31c2F6fcFf4F8759b3Bd5Bf0e1084A055615c768'

export const MaxUint48 = BigInt('0xffffffffffff');
export const MaxUint160 = BigInt('0xffffffffffffffffffffffffffffffffffffffff');
export const MaxUint256 = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');

// alias max types for their usages
// allowance transfer types
export const MaxAllowanceTransferAmount = MaxUint160
export const MaxAllowanceExpiration = MaxUint48
export const MaxOrderedNonce = MaxUint48

// signature transfer types
export const MaxSignatureTransferAmount = MaxUint256
export const MaxUnorderedNonce = MaxUint256
export const MaxSigDeadline = MaxUint256

export const InstantExpiration = BigInt('0')
