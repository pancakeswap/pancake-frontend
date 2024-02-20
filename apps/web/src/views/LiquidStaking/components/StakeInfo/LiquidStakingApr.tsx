import { useTranslation } from '@pancakeswap/localization'
import { Flex, QuestionHelper, RowBetween, Text } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import formatLocaleNumber from 'utils/formatLocaleNumber'
import { useLiquidStakingApr } from 'views/LiquidStaking/hooks/useLiquidStakingApr'

interface LiquidStakingAprProps {
  contract?: string
  tokenOSymbol?: string
}

export const LiquidStakingApr: React.FC<LiquidStakingAprProps> = ({ contract, tokenOSymbol }) => {
  const { t } = useTranslation()
  const {
    currentLanguage: { locale },
  } = useTranslation()
  const { aprs } = useLiquidStakingApr()

  const tooltipMsg = t(`APR is calculated based on the past 24H of staking rewards from the %token0% network.`, {
    token0: tokenOSymbol ?? '',
  })

  const apr = useMemo(
    () => aprs?.find((i) => i?.contract?.toLowerCase() === contract?.toLowerCase())?.apr,
    [aprs, contract],
  )

  return (
    <RowBetween mb="8px">
      <Flex>
        <Text color="textSubtle">{t('Est. APR')}</Text>
        <QuestionHelper ml="4px" text={tooltipMsg} size="20px" placement="bottom" />
      </Flex>
      <Text>{apr ? `${formatLocaleNumber({ number: apr, locale })}%` : '-'}</Text>
    </RowBetween>
  )
}
