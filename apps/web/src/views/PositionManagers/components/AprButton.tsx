import { useTranslation } from '@pancakeswap/localization'
import {
  Flex,
  RoiCalculatorModal,
  Skeleton,
  Text,
  useModal,
  useTooltip,
  IconButton,
  CalculateIcon,
} from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useCakePrice } from 'hooks/useCakePrice'
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
}: Props) {
  const { t } = useTranslation()

  const { address: account } = useAccount()
  const cakePriceBusd = useCakePrice()
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
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text>
        {t('Combined APR')}:
        <Text ml="3px" style={{ display: 'inline-block' }} bold>
          {`${apr.combinedApr}%`}
        </Text>
      </Text>
      <ul>
        {apr.isInCakeRewardDateRange && (
          <li>
            {t('CAKE APR')}:
            <Text ml="3px" style={{ display: 'inline-block' }} bold>
              {`${apr.cakeYieldApr}%`}
            </Text>
          </li>
        )}
        <li>
          {t('LP APR')}:
          <Text ml="3px" style={{ display: 'inline-block' }} bold>
            {apr.lpApr}%
          </Text>
        </li>
      </ul>
      <Text lineHeight="120%" mt="20px">
        {t(`Calculated based on previous %days% days average data.`, { days: 1 })}
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
      earningTokenPrice={cakePriceBusd.toNumber()}
      apr={Number(apr.cakeYieldApr) + Number(apr.lpApr)}
      displayApr={apr.combinedApr}
      linkHref=""
    />,
    false,
    true,
    `PositionManagerModal${id}`,
  )

  return (
    <Flex flexDirection="row" justifyContent="center" alignItems="center">
      {apr && !isAprLoading ? (
        <>
          <AprText color="success" ref={targetRef} bold onClick={onPresentApyModal}>
            {`${apr.combinedApr}%`}
            {tooltipVisible && tooltip}
          </AprText>
          <IconButton variant="text" scale="sm" onClick={onPresentApyModal}>
            <CalculateIcon mt="3px" color="textSubtle" ml="3px" width="20px" />
          </IconButton>
        </>
      ) : (
        <Skeleton width={50} height={20} />
      )}
    </Flex>
  )
})
