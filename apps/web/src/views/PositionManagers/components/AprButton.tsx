import { useTranslation } from '@pancakeswap/localization'
import { Flex, RoiCalculatorModal, Skeleton, Text, useModal, useTooltip } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useCakePrice } from 'hooks/useCakePrice'
import { memo } from 'react'
import { styled } from 'styled-components'
import { useAccount } from 'wagmi'
import { AprResult } from '../hooks'

interface Props {
  id: number | string
  apr: AprResult
  isAprLoading: boolean
  lpSymbol: string
  totalAssetsInUsd: number
}

const AprText = styled(Text)`
  text-underline-offset: 0.125em;
  text-decoration: dotted underline;
  cursor: pointer;
`

export const AprButton = memo(function YieldInfo({ id, apr, isAprLoading, totalAssetsInUsd, lpSymbol }: Props) {
  const { t } = useTranslation()

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
      stakingTokenSymbol={lpSymbol}
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
