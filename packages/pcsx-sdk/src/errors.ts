export class MissingConfiguration extends Error {
  constructor(key: string, value: string) {
    super(`Missing configuration for ${key}: ${value}`)
    Object.setPrototypeOf(this, MissingConfiguration.prototype)
  }
}

export enum OrderValidation {
  Expired,
  NonceUsed,
  InsufficientFunds,
  InvalidSignature,
  DeadlineBeforeEndTime,
  InvalidReactor,
  InputAndOutputDecay,
  IncorrectAmounts,
  EndTimeBeforeStartTime,
  OrderEndTimeBeforeStartTime,
  UnknownError,
  ValidationFailed,
  ExclusivityPeriod,
  NotSupportedChain,
  OK,
}

export const BASIC_ERROR = '0x08c379a0'

export const KNOWN_ERRORS: { [key: string]: OrderValidation } = {
  // "8baa579f": OrderValidation.InvalidSignature,
  // Base Reactor InvalidSigner
  '815e1d64': OrderValidation.InvalidSignature,
  // Base Reactor InvalidNonce
  '756688fe': OrderValidation.NonceUsed,
  // invalid dutch decay time
  // "302e5b7c": OrderValidation.InvalidOrderFields,
  // Dutch Order Reactor DeadlineBeforeEndTime
  '773a6187': OrderValidation.DeadlineBeforeEndTime,
  // Resolved Order Lib InvalidReactor
  '4ddf4a64': OrderValidation.InvalidReactor,
  // Dutch Order Reactor InputAndOutputDecay
  d303758b: OrderValidation.InputAndOutputDecay,
  // Dutch Decay Lib IncorrectAmounts
  '7c1f8113': OrderValidation.IncorrectAmounts,
  // Dutch Decay Lib EndTimeBeforeStartTime
  '43133453': OrderValidation.EndTimeBeforeStartTime,
  // Exclusive Dutch Order Reactor OrderEndTimeBeforeStartTime
  '48fee69c': OrderValidation.OrderEndTimeBeforeStartTime,
  // Resolved Order Lib DeadlinePassed
  '70f65caa': OrderValidation.Expired,
  // ee3b3d4b: OrderValidation.NonceUsed,
  // "0a0b0d79": OrderValidation.ValidationFailed,
  // Exclusitivity Override Lib NoExclusiveOverride
  b9ec1e96: OrderValidation.ExclusivityPeriod,
  // "062dec56": OrderValidation.ExclusivityPeriod,
  // Exclusive Filler Validation NotExclusiveFiller
  '75c1bb14': OrderValidation.ExclusivityPeriod,
  // Usually did not approve permit2
  TRANSFER_FROM_FAILED: OrderValidation.InsufficientFunds,
}
