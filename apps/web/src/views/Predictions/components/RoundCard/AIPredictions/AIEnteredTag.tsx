import { useTranslation } from '@pancakeswap/localization'
import { REWARD_RATE } from '@pancakeswap/prediction'
import { CheckmarkCircleFillIcon, Tag, useTooltip } from '@pancakeswap/uikit'
import { bigIntToBigNumber } from '@pancakeswap/utils/bigNumber'
import { useMemo } from 'react'
import { useConfig } from 'views/Predictions/context/ConfigProvider'
import { formatTokenv2 } from '../../../helpers'

interface AIEnteredTagProps {
  amount?: bigint
  hasClaimed?: boolean
  multiplier: string
}

export const AIEnteredTag: React.FC<React.PropsWithChildren<AIEnteredTagProps>> = ({
  amount,
  hasClaimed = false,
  multiplier,
}) => {
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
      <span
        ref={targetRef}
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
        }}
      >
        {hasClaimed ? (
          <Tag
            variant="secondary"
            fontWeight="bold"
            textTransform="uppercase"
            outline={!hasClaimed}
            startIcon={<CheckmarkCircleFillIcon color="white" width="18px" />}
          >
            {t('Claimed')}
          </Tag>
        ) : (
          <CheckmarkCircleFillIcon color="secondary" width="20px" />
        )}
      </span>
      {tooltipVisible && tooltip}
    </>
  )
}
