import { TranslateFunction } from '@pancakeswap/localization'
import { parseViemError } from './errors'

/**
 * This is hacking out the revert reason from the ethers provider thrown error however it can.
 * This object seems to be undocumented by ethers.
 * @param error an error from the ethers provider
 * @param t Translation function
 */
export function transactionErrorToUserReadableMessage(error: any, t: TranslateFunction) {
  let reason: string | undefined
  const parsedError = parseViemError(error)
  if (parsedError) {
    reason = parsedError.details || parsedError.shortMessage || parsedError.message
  } else {
    while (error) {
      reason = error.reason ?? error.data?.message ?? error.message ?? reason
      // eslint-disable-next-line no-param-reassign
      error = error.error ?? error.data?.originalError
    }
  }

  if (reason?.indexOf('execution reverted: ') === 0) reason = reason.substring('execution reverted: '.length)

  const formatErrorMessage = (message: string) => [message, `(${reason})`].join(' ')
  switch (reason) {
    case 'PancakeRouter: EXPIRED':
      return formatErrorMessage(
        t(
          'The transaction could not be sent because the deadline has passed. Please check that your transaction deadline is not too low.',
        ),
      )
    case 'PancakeRouter: INSUFFICIENT_OUTPUT_AMOUNT':
    case 'PancakeRouter: EXCESSIVE_INPUT_AMOUNT':
    case 'PancakeRouter: INSUFFICIENT_A_AMOUNT':
    case 'PancakeRouter: INSUFFICIENT_B_AMOUNT':
    case 'swapMulti: incorrect user balance':
    case 'Pancake: K':
      return formatErrorMessage(
        t(
          'This transaction will not succeed either due to price movement or fee on transfer. Try increasing your slippage tolerance.',
        ),
      )
    case 'TransferHelper: TRANSFER_FROM_FAILED':
      return formatErrorMessage(t('The input token cannot be transferred. There may be an issue with the input token.'))
    case 'Pancake: TRANSFER_FAILED':
      return formatErrorMessage(
        t('The output token cannot be transferred. There may be an issue with the output token.'),
      )
    case 'Too little received':
    case 'Too much requested':
    case 'STF':
      return t(
        'This transaction will not succeed due to price movement. Try increasing your slippage tolerance. Note: fee on transfer and rebase tokens are incompatible with Pancakeswap V3.',
      )
    case 'TF':
      return t(
        'The output token cannot be transferred. There may be an issue with the output token. Note: fee on transfer and rebase tokens are incompatible with Pancakeswap V3.',
      )
    default:
      if (reason?.indexOf('undefined is not an object') !== -1) {
        console.error(error, reason)
        return t(
          'An error occurred when trying to execute this operation. You may need to increase your slippage tolerance. If that does not work, there may be an incompatibility with the token you are trading.',
        )
      }
      return t('Unknown error%reason%. Try increasing your slippage tolerance.', {
        reason: reason ? `: "${reason}"` : '',
      })
  }
}
