import { useTranslation } from '@pancakeswap/localization'
import { Flex, RoiCalculatorModal, Skeleton, Text, useModal, useTooltip } from '@pancakeswap/uikit'
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
  totalAssetsInUsd: number
  userLpAmounts?: bigint
  totalSupplyAmounts?: bigint
  precision?: bigint
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
  totalAssetsInUsd,
  lpSymbol,
  userLpAmounts,
  precision,
}: Props) {
  const { t } = useTranslation()

  const { address: account } = useAccount()
  const cakePriceBusd = useCakePrice()
  const tokenBalance = useMemo(
    () => new BigNumber(Number(((userLpAmounts ?? 0n) * 10000n) / (precision ?? 1n)) / 10000 ?? 0),
    [userLpAmounts, precision],
  )

  const tokenPrice = useMemo(
    () => totalAssetsInUsd / (Number(((userLpAmounts ?? 0n) * 10000n) / (precision ?? 1n)) / 10000 ?? 0),
    [userLpAmounts, precision, totalAssetsInUsd],
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
        {t('Calculated based on previous 7 days average data.')}
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
      stakingTokenDecimals={0}
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
    <Flex flexDirection="row" justifyContent="flex-end" alignItems="center">
      {apr && !isAprLoading ? (
        <AprText color="success" ref={targetRef} bold onClick={onPresentApyModal}>
          {`${apr.combinedApr}%`}
          {tooltipVisible && tooltip}
        </AprText>
      ) : (
        <Skeleton width={50} height={20} />
      )}
    </Flex>
  )
})
