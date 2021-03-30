import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { AutoRenewIcon, Button } from '@pancakeswap-libs/uikit'
import BigNumber from 'bignumber.js'
import { BetPosition } from 'state/types'
import { useToast } from 'state/hooks'
import { usePredictionsContract } from 'hooks/useContract'
import useI18n from 'hooks/useI18n'
import UnlockButton from 'components/UnlockButton'
import { getDecimalAmount } from 'utils/formatBalance'
import { getBnbAmount, formatBnb } from '../../helpers'

interface SetPositionButtonProps {
  value: BigNumber
  bnbBalance: BigNumber
  betPosition: BetPosition
  minBetAmountBalance: number
}

const getButtonProps = (
  value: SetPositionButtonProps['value'],
  bnbBalance: SetPositionButtonProps['bnbBalance'],
  minBetAmountBalance: SetPositionButtonProps['minBetAmountBalance'],
) => {
  if (bnbBalance.eq(0)) {
    return { id: 999, fallback: 'Insufficient BNB balance', disabled: true }
  }

  if (value.eq(0) || value.isNaN()) {
    return { id: 999, fallback: 'Enter an amount', disabled: true }
  }

  return { id: 464, fallback: 'Confirm', disabled: value.lt(minBetAmountBalance) }
}

const SetPositionButton: React.FC<SetPositionButtonProps> = ({
  value,
  bnbBalance,
  betPosition,
  minBetAmountBalance,
}) => {
  const [isTxPending, setIsTxPending] = useState(false)
  const { account } = useWeb3React()
  const TranslateString = useI18n()
  const predictionsContract = usePredictionsContract()
  const { toastSuccess, toastError } = useToast()

  if (!account) {
    return <UnlockButton width="100%" />
  }

  const { id, fallback, disabled } = getButtonProps(value, bnbBalance, minBetAmountBalance)

  const handleClick = () => {
    const betMethod = betPosition === BetPosition.BULL ? 'betBull' : 'betBear'
    const decimalValue = getDecimalAmount(value)
    predictionsContract.methods[betMethod]()
      .send({ from: account, value: decimalValue })
      .on('sending', () => {
        setIsTxPending(true)
      })
      .on('receipt', () => {
        setIsTxPending(false)
        const positionDisplay = betPosition === BetPosition.BULL ? 'Bull' : 'Bear'
        const valueAmount = formatBnb(getBnbAmount(value).toNumber())

        toastSuccess(
          'Success!',
          TranslateString(999, `You have entered the ${positionDisplay} position for ${valueAmount} BNB`, {
            position: positionDisplay,
            num: valueAmount,
            token: 'BNB',
          }),
        )
      })
      .on('error', (error) => {
        const errorMsg = TranslateString(999, 'An error occurred, unable to enter your position')

        toastError('Error!', errorMsg)
        setIsTxPending(false)
        console.error(errorMsg, error)
      })
  }

  return (
    <Button
      width="100%"
      disabled={disabled}
      onClick={handleClick}
      isLoading={isTxPending}
      endIcon={isTxPending ? <AutoRenewIcon color="currentColor" spin /> : null}
    >
      {TranslateString(id, fallback)}
    </Button>
  )
}

export default SetPositionButton
