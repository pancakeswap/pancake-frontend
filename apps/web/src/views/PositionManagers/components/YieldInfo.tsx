import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, RoiCalculatorModal, RowBetween, Skeleton, Text, useModal, useTooltip } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useCakePrice } from 'hooks/useCakePrice'
import { memo, useMemo } from 'react'
import { styled } from 'styled-components'
import { useAccount } from 'wagmi'
import { AprResult } from '../hooks'
import { AutoCompoundTag } from './Tags'

interface Props {
  id: number | string
  apr: AprResult
  isAprLoading: boolean
  withCakeReward?: boolean
  autoCompound?: boolean
  totalAssetsInUsd: number
  onAprClick?: () => void
}

const AprText = styled(Text)`
  text-underline-offset: 0.125em;
  text-decoration: dotted underline;
  cursor: pointer;
`

export const YieldInfo = memo(function YieldInfo({
  id,
  apr,
  isAprLoading,
  withCakeReward,
  autoCompound,
  totalAssetsInUsd,
}: Props) {
  const { t } = useTranslation()

  const earning = useMemo(() => (withCakeReward ? ['CAKE', t('Fees')].join(' + ') : t('Fees')), [withCakeReward, t])
  const { address: account } = useAccount()
  const cakePriceBusd = useCakePrice()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text>
        {t('Combined APR')}:{' '}
        <Text style={{ display: 'inline-block' }} bold>
          {`${apr.combinedApr}%`}
        </Text>
      </Text>
      <ul>
        <li>
          {t('CAKE APR')}:{' '}
          <Text style={{ display: 'inline-block' }} bold>
            {`${apr.cakeYieldApr}%`}
          </Text>
        </li>
        <li>
          {t('LP APR')}:{' '}
          <Text style={{ display: 'inline-block' }} bold>
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
      stakingTokenBalance={new BigNumber(10)}
      stakingTokenDecimals={1}
      stakingTokenSymbol={`CAKE-USDT${id}`}
      stakingTokenPrice={totalAssetsInUsd}
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
    <Box>
      <RowBetween>
        <Text>{t('APR')}:</Text>
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
      </RowBetween>
      <RowBetween>
        <Text>{t('Earn')}:</Text>
        <Flex flexDirection="row" justifyContent="flex-end" alignItems="center">
          <Text color="text">{earning}</Text>
          {autoCompound && <AutoCompoundTag ml="0.5em" />}
        </Flex>
      </RowBetween>
    </Box>
  )
})
