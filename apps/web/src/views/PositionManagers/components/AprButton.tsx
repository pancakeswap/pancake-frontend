import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import {
  CalculateIcon,
  Flex,
  IconButton,
  RocketIcon,
  RoiCalculatorModal,
  Skeleton,
  Text,
  useModal,
  useTooltip,
} from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useCurrencyUsdPrice } from 'hooks/useCurrencyUsdPrice'
import { memo, useMemo } from 'react'
import { styled } from 'styled-components'
import { useAccount } from 'wagmi'
import { AprResult } from '../hooks'

interface Props {
  id: number | string
  apr: AprResult
  isAprLoading: boolean
  lpSymbol: string
  totalStakedInUsd: number
  totalAssetsInUsd: number
  userLpAmounts?: bigint
  totalSupplyAmounts?: bigint
  precision?: bigint
  lpTokenDecimals?: number
  aprTimeWindow?: number
  rewardToken?: Currency
  isBooster?: boolean
  boosterMultiplier?: number
}

const AprText = styled(Text)`
  text-underline-offset: 0.125em;
  text-decoration: dotted underline;
  cursor: pointer;
`

export const AprButton = memo(function YieldInfo({
  id,
  apr,
  isAprLoading,
  totalStakedInUsd,
  lpSymbol,
  userLpAmounts,
  totalSupplyAmounts,
  precision,
  lpTokenDecimals = 0,
  aprTimeWindow = 0,
  rewardToken,
  isBooster,
  boosterMultiplier = 3,
}: Props) {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { data: rewardUsdPrice } = useCurrencyUsdPrice(rewardToken)
  const tokenBalanceMultiplier = useMemo(() => new BigNumber(10).pow(lpTokenDecimals), [lpTokenDecimals])
  const tokenBalance = useMemo(
    () =>
      new BigNumber(Number(((userLpAmounts ?? 0n) * 10000n) / (precision ?? 1n)) / 10000 ?? 0).times(
        tokenBalanceMultiplier,
      ),
    [userLpAmounts, precision, tokenBalanceMultiplier],
  )

  const tokenPrice = useMemo(
    () => totalStakedInUsd / (Number(((totalSupplyAmounts ?? 0n) * 10000n) / (precision ?? 1n)) / 10000 ?? 0),
    [totalSupplyAmounts, precision, totalStakedInUsd],
  )

  const cakeAPR = useMemo(() => parseFloat(apr?.cakeYieldApr ?? '0'), [apr])
  const lpAPR = useMemo(() => parseFloat(apr?.lpApr ?? '0'), [apr])
  const combinedAPR = useMemo(
    () => (isBooster ? (cakeAPR * boosterMultiplier + lpAPR).toFixed(2) : apr.combinedApr),
    [apr.combinedApr, boosterMultiplier, cakeAPR, isBooster, lpAPR],
  )

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text>
        {t('Combined APR')}:
        <Text ml="3px" style={{ display: 'inline-block' }} bold>
          {`${combinedAPR}%`}
        </Text>
      </Text>
      <ul>
        {apr.isInCakeRewardDateRange && rewardToken && (
          <>
            <li>
              {`${rewardToken?.symbol ?? ''} ${t('APR')}`}:{' '}
              <b>
                {isBooster && <>{(boosterMultiplier * cakeAPR).toFixed(2)}% </>}
                <Text
                  display="inline-block"
                  style={{ textDecoration: isBooster ? 'line-through' : 'none', fontWeight: 800 }}
                >
                  {cakeAPR.toFixed(2)}%
                </Text>
              </b>
            </li>
          </>
        )}
        <li>
          {t('LP APR')}:
          <Text ml="3px" style={{ display: 'inline-block' }} bold>
            {apr.lpApr}%
          </Text>
        </li>
      </ul>
      {isBooster && (
        <Text mt="15px">
          {t(
            'bCAKE only boosts token incentive (often CAKE) APR. Actual multiplier is subject to position manager and veCAKE pool condition.',
          )}
        </Text>
      )}
      <Text lineHeight="120%" mt="20px">
        {aprTimeWindow > 0
          ? t(`Calculated based on previous %days% days average data.`, { days: aprTimeWindow })
          : t('Calculated based average data since vault inception.')}
      </Text>
    </>,
    {
      placement: 'top',
    },
  )

  const [onPresentApyModal] = useModal(
    <RoiCalculatorModal
      account={account ?? ''}
      pid={Number(id)}
      linkLabel=""
      stakingTokenBalance={tokenBalance}
      stakingTokenDecimals={lpTokenDecimals}
      stakingTokenSymbol={lpSymbol}
      stakingTokenPrice={tokenPrice}
      earningTokenPrice={rewardUsdPrice ?? 0}
      apr={(isBooster ? boosterMultiplier * cakeAPR : cakeAPR) + lpAPR}
      displayApr={apr.combinedApr}
      linkHref=""
    />,
    false,
    true,
    `PositionManagerModal${id}`,
  )

  return (
    <Flex
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      onClick={(e) => {
        e.stopPropagation()
        onPresentApyModal()
      }}
    >
      {apr && !isAprLoading ? (
        <>
          <Text ref={targetRef} display="flex" style={{ gap: 3, whiteSpace: 'nowrap' }}>
            {isBooster && <RocketIcon color="success" />}
            {isBooster && boosterMultiplier === 3 && <Text color="success">{t('Up to')}</Text>}
            <AprText display="flex" style={{ gap: 3 }}>
              {isBooster && (
                <Text color="success" bold onClick={onPresentApyModal}>
                  {`${combinedAPR}%`}
                </Text>
              )}
              <Text style={{ textDecoration: isBooster ? 'line-through' : undefined }}>{`${apr.combinedApr}%`}</Text>
            </AprText>
            {tooltipVisible && tooltip}
          </Text>
          <IconButton variant="text" scale="sm">
            <CalculateIcon mt="3px" color="textSubtle" ml="3px" width="20px" />
          </IconButton>
        </>
      ) : (
        <Skeleton width={50} height={20} />
      )}
    </Flex>
  )
})
