import { useTranslation } from '@pancakeswap/localization'
import { REWARD_RATE } from '@pancakeswap/prediction'
import { CheckmarkCircleFillIcon, CheckmarkCircleIcon, Tag, useTooltip } from '@pancakeswap/uikit'
import { bigIntToBigNumber } from '@pancakeswap/utils/bigNumber'
import { useMemo } from 'react'
import { useConfig } from 'views/Predictions/context/ConfigProvider'
import { formatTokenv2 } from '../../helpers'

interface EnteredTagProps {
  amount?: bigint
  hasClaimed?: boolean
  multiplier: string
}

const EnteredTag: React.FC<React.PropsWithChildren<EnteredTagProps>> = ({ amount, hasClaimed = false, multiplier }) => {
  const { t } = useTranslation()
  const config = useConfig()

  const formattedAmount = useMemo(() => {
    let tokenAmount
    if (hasClaimed) {
      if (amount) {
        const multiplierNumber = parseFloat(multiplier)
        tokenAmount = bigIntToBigNumber(amount)
          .times(Number.isFinite(multiplierNumber) ? multiplierNumber * REWARD_RATE : 1)
          .toFixed(0)
      }
    } else {
      tokenAmount = amount
    }
    return formatTokenv2(tokenAmount, config?.token?.decimals ?? 0, config?.displayedDecimals ?? 0)
  }, [amount, config, hasClaimed, multiplier])

  const { targetRef, tooltipVisible, tooltip } = useTooltip(
    <div style={{ whiteSpace: 'nowrap' }}>{`${formattedAmount} ${config?.token?.symbol}`}</div>,
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
          startIcon={
            hasClaimed ? (
              <CheckmarkCircleFillIcon color="white" width="18px" />
            ) : (
              <CheckmarkCircleIcon color="secondary" width="18px" />
            )
          }
        >
          {hasClaimed ? t('Claimed') : t('Entered')}
        </Tag>{' '}
      </span>{' '}
      {tooltipVisible && tooltip}
    </>
  )
}

export default EnteredTag
