import { useMemo } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { CheckmarkCircleIcon, CheckmarkCircleFillIcon, Tag, useTooltip } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { ethersToBigNumber } from 'utils/bigNumber'
import { REWARD_RATE } from 'state/predictions/config'
import { useConfig } from 'views/Predictions/context/ConfigProvider'
import { formatBnbv2 } from '../../helpers'

interface EnteredTagProps {
  amount?: BigNumber
  hasClaimed?: boolean
  multiplier: string
}

const EnteredTag: React.FC<React.PropsWithChildren<EnteredTagProps>> = ({ amount, hasClaimed = false, multiplier }) => {
  const { t } = useTranslation()
  const { token, displayedDecimals } = useConfig()

  const formattedAmount = useMemo(() => {
    let tokenAmount
    if (hasClaimed) {
      if (amount) {
        const multiplierNumber = parseFloat(multiplier)
        tokenAmount = BigNumber.from(
          ethersToBigNumber(amount)
            .times(Number.isFinite(multiplierNumber) ? multiplierNumber * REWARD_RATE : 1)
            .toFixed(0),
        )
      }
    } else {
      tokenAmount = amount
    }
    return formatBnbv2(tokenAmount, displayedDecimals)
  }, [amount, displayedDecimals, hasClaimed, multiplier])

  const { targetRef, tooltipVisible, tooltip } = useTooltip(
    <div style={{ whiteSpace: 'nowrap' }}>{`${formattedAmount} ${token.symbol}`}</div>,
    { placement: 'bottom' },
  )

  return (
    <>
      <span ref={targetRef}>
        <Tag
          variant="secondary"
          fontWeight="bold"
          textTransform="uppercase"
          outline={!hasClaimed}
          startIcon={hasClaimed ? <CheckmarkCircleFillIcon width="18px" /> : <CheckmarkCircleIcon width="18px" />}
        >
          {hasClaimed ? t('Claimed') : t('Entered')}
        </Tag>{' '}
      </span>{' '}
      {tooltipVisible && tooltip}
    </>
  )
}

export default EnteredTag
