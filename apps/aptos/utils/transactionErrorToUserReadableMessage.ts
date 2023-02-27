import _isString from 'lodash/isString'

/**
 * This is hacking out the revert reason from the ethers provider thrown error however it can.
 * This object seems to be undocumented by ethers.
 * @param error an error from the ethers provider
 */
export function transactionErrorToUserReadableMessage(error: any) {
  // NOTE: Martian returns string error when cancel
  if (_isString(error)) return error

  return error?.message
}
