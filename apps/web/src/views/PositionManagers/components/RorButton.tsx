import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import { Flex, Skeleton, Text, useTooltip } from '@pancakeswap/uikit'
import { memo, useMemo } from 'react'
import { styled } from 'styled-components'
import type { AprResult } from '../hooks'

interface Props {
  apr: AprResult
  isAprLoading: boolean
  rewardToken?: Currency
  isBooster?: boolean
  boosterMultiplier?: number
  ror?: number
}

const AprText = styled(Text)`
  text-underline-offset: 0.125em;
  text-decoration: dotted underline;
  cursor: pointer;
`

export const RorButton = memo(function YieldInfo({
  apr,
  isAprLoading,
  rewardToken,
  isBooster,
  boosterMultiplier = 3,
  ror,
}: Props) {
  const { t } = useTranslation()

  const cakeAPR = useMemo(() => parseFloat(apr?.cakeYieldApr ?? '0'), [apr])
  const lpAPR = useMemo(() => parseFloat(apr?.lpApr ?? '0'), [apr])
  const combinedAPR = useMemo(
    () => (isBooster ? (cakeAPR * boosterMultiplier + lpAPR).toFixed(2) : apr.combinedApr),
    [apr.combinedApr, boosterMultiplier, cakeAPR, isBooster, lpAPR],
  )

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text>
        {t('ROR (Rate Of Return)')}:
        <Text ml="3px" style={{ display: 'inline-block' }} bold>
          {`${ror / 10 ** 18}%`}
        </Text>
      </Text>
      <ul>
        {apr.isInCakeRewardDateRange && rewardToken && (
          <>
            <li>
              {`${rewardToken?.symbol ?? ''} ${t('1 Week')}`}:{' '}
              <b>
                {isBooster && <>{(boosterMultiplier * cakeAPR).toFixed(2)}% </>}
                <Text
                  display="inline-block"
                  style={{ textDecoration: isBooster ? 'line-through' : 'none', fontWeight: 800 }}
                >
                  {ror.toFixed(2)}%
                </Text>
              </b>
            </li>
          </>
        )}
        <li>
          {t('1 Month APR')}:
          <Text ml="3px" style={{ display: 'inline-block' }} bold>
            {apr.lpApr}%
          </Text>
        </li>
      </ul>
      <Text lineHeight="120%" mt="20px">
        {t('ROR Calculated based on historical snapshots factoring inhistorical price of the underlying tokens')}
      </Text>
    </>,
    {
      placement: 'top',
    },
  )

  return (
    <Flex flexDirection="row" justifyContent="center" alignItems="center" ref={targetRef}>
      {apr && !isAprLoading ? (
        <>
          <Text display="flex" mx="6px" style={{ gap: 3, whiteSpace: 'nowrap' }}>
            <AprText display="flex" style={{ gap: 3 }}>
              <Text color="success" bold onClick={() => null}>
                {`${combinedAPR}%`}
              </Text>
            </AprText>
            {tooltipVisible && tooltip}
          </Text>
          <Text bold>{t('(Since Launch)')}</Text>
        </>
      ) : (
        <Skeleton width={50} height={20} />
      )}
    </Flex>
  )
})
